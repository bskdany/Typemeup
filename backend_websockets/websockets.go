package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/goombaio/namegenerator"
	"github.com/gorilla/websocket"
)

type Player struct {
	socket         *websocket.Conn
	competition    *Competition
	userId         string
	progress       int
	hasFinished    bool
	receiveUpdates bool
}

type WSRequest struct {
	Type                    string
	UserId                  string
	Progress                uint8
	CompetitionWordsAmount  uint8
	CompetitionPlayerAmount uint8
}

type WSResponse struct {
	Type       string   `json:"type"`
	TargetText []string `json:"targetText,omitempty"`
	Players    []string `json:"players,omitempty"`
	Progress   struct {
		UserId string `json:"userId"`
		Amount uint8  `json:"amount"`
	} `json:"progress,omitempty"`
	PlayersWaiting uint8 `json:"playersWaiting,omitempty"`
}

type Competition struct {
	Id                   int
	Players              []*Player
	TargetText           []string
	HasOnePlayerFinished bool
	HasCountdownFinished bool
}

const PLAYERS_PER_COMPETITION = 2
const COUNTDOWN_TIME = 3

var COMPETITION_ID = 0

var waitingPlayers []*Player = []*Player{}
var activePlayers = make(map[*websocket.Conn]*Player)

// var activeCompetitions = make(map[int]*Competition)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func sendMessageToCompetition(competition *Competition, response *WSResponse) {
	for _, player := range competition.Players {
		if player.receiveUpdates {
			player.socket.WriteJSON(response)
		}
	}
}

func sendWaitingRoomUpdate() {
	for _, player := range waitingPlayers {
		player.socket.WriteJSON(WSResponse{Type: "waiting", PlayersWaiting: uint8(len(waitingPlayers))})
	}
}

func handleDisconnection(conn *websocket.Conn) {
	player := activePlayers[conn]

	if player.competition != nil {
		// player is in a competition, keeping it in BUT remove the possibility of receiving updates
		player.receiveUpdates = false
		log.Println("player", player.userId, "disconnected")

		// if no players in the competition receive updates, remove the competition

		activePlayerCount := 0
		for _, player := range player.competition.Players {
			if player.receiveUpdates {
				activePlayerCount++
			}
		}

		if activePlayerCount == 0 {

			competitionId := player.competition.Id
			// all players are safe to remove themselves from the competition
			for _, player := range player.competition.Players {
				player.competition = nil
			}
			log.Println("competition", competitionId, "removed because all players disconnected")
		}
	} else {
		// player is in the waiting room, removing it
		for i, p := range waitingPlayers {
			if p == player {
				waitingPlayers = append(waitingPlayers[:i], waitingPlayers[i+1:]...)
				break
			}
		}
		sendWaitingRoomUpdate()
		log.Println("player", player.userId, "disconnected and removed from waiting room")
	}

	delete(activePlayers, conn)
}

func initializePlayer(request *WSRequest, conn *websocket.Conn) {
	player := Player{
		socket: conn,
		userId: func() string {
			if request.UserId == "" {
				return generateUserId()
			}
			return request.UserId
		}(),
		competition:    nil,
		progress:       0,
		hasFinished:    false,
		receiveUpdates: true,
	}
	// add player to active players
	activePlayers[conn] = &player

	log.Println("initialized player", player.userId)
}

func joinWaitingRoom(player *Player) {
	waitingPlayers = append(waitingPlayers, player)
	log.Println("player", player.userId, "joined waiting room")

	if len(waitingPlayers) >= PLAYERS_PER_COMPETITION {
		createCompetition(waitingPlayers[0:PLAYERS_PER_COMPETITION])
		waitingPlayers = waitingPlayers[PLAYERS_PER_COMPETITION:]
	} else {
		sendWaitingRoomUpdate()
	}
}

func createCompetition(players []*Player) {
	competitionId := COMPETITION_ID
	COMPETITION_ID++

	competition := Competition{
		Id:                   competitionId,
		Players:              players,
		TargetText:           []string{"Hello", "world"},
		HasOnePlayerFinished: false,
		HasCountdownFinished: false,
	}

	playerUserIds := make([]string, len(players))
	for i, player := range players {
		playerUserIds[i] = player.userId
		player.competition = &competition
	}

	log.Println("competition", competitionId, "created with players", playerUserIds)

	sendMessageToCompetition(&competition, &WSResponse{Type: "matchFound", TargetText: competition.TargetText, Players: playerUserIds})

	time.AfterFunc(COUNTDOWN_TIME*time.Second, func() {
		competition.HasCountdownFinished = true
	})
}

func updateProgress(player *Player, request *WSRequest) {
	player.progress = int(request.Progress)

	response := WSResponse{Type: "progress", Progress: struct {
		UserId string `json:"userId"`
		Amount uint8  `json:"amount"`
	}{UserId: player.userId, Amount: uint8(player.progress)}}

	sendMessageToCompetition(player.competition, &response)
}

func generateUserId() string {
	nameGenerator := namegenerator.NewNameGenerator(time.Now().UnixNano())
	return nameGenerator.Generate()
}

func handler(writer http.ResponseWriter, request *http.Request) {
	var conn, err = upgrader.Upgrade(writer, request, nil)
	if err != nil {
		log.Println(err)
		return
	}

	// initialize empty player
	var player *Player = nil

	// handle player messages
	for {
		var request WSRequest
		var err = conn.ReadJSON(&request)
		if err != nil {
			// player disconnected
			handleDisconnection(conn)
			return
		}

		switch request.Type {
		case "join":
			if activePlayers[conn] == nil {
				// player not initialized
				initializePlayer(&request, conn)
				player = activePlayers[conn]
			}

			joinWaitingRoom(player)
		case "progress":
			if player != nil {
				updateProgress(player, &request)
			}
		}

	}
}

func main() {
	http.HandleFunc("/compete", handler)
	http.ListenAndServe(":8080", nil)
	fmt.Println("Server is running on port 8080")
}
