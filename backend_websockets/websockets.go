package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/goombaio/namegenerator"
	"github.com/gorilla/websocket"
)

type Player struct {
	socket      *websocket.Conn
	playerId    string
	name        string
	competition *Competition
}

// player data is not attached to the player, but instead to the competition itself
// this is beause if the player leaves the competition and starts a new one while
// there are still users typing in the old one, the data will be wrong
type PlayerData struct {
	PlayerId    string  `json:"playerId,omitempty"`
	Name        string  `json:"name,omitempty"`
	Wpm         float32 `json:"wpm"`
	Accuracy    float32 `json:"accuracy"`
	Ranking     uint8   `json:"ranking"`
	HasFinished bool    `json:"hasFinished,omitempty"`
	Progress    uint8   `json:"progress"`
}

type WSRequest struct {
	Type                    string
	Name                    string
	Progress                uint8
	CompetitionWordsAmount  uint8
	CompetitionPlayerAmount uint8
	Wpm                     float32
	Accuracy                float32
}

type WSResponse struct {
	Type           string       `json:"type"`
	TargetText     []string     `json:"targetText,omitempty"`
	PlayerId       string       `json:"playerId,omitempty"`
	PlayersWaiting uint8        `json:"playersWaiting,omitempty"`
	PlayersData    []PlayerData `json:"playersData,omitempty"`
	PlayerData     PlayerData   `json:"playerData,omitempty"`
}

type Competition struct {
	id                   int
	players              map[string]*Player
	targetText           []string
	hasCountDownFinished bool
	capacity             uint8
	activePlayers        uint8
	playersData          map[string]*PlayerData
}

const PLAYERS_PER_COMPETITION = 3
const COUNTDOWN_TIME = 3
const TIMEOUT_TIME = 10

var COMPETITION_ID = 0

var waitingPlayers []*Player = []*Player{}
var existingPlayers = make(map[*websocket.Conn]*Player)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func initializePlayer(request *WSRequest, conn *websocket.Conn) {
	player := Player{
		socket:   conn,
		playerId: uuid.NewString(),
		name: func() string {
			if request.Name == "" {
				return generatePlayerName()
			}
			return request.Name
		}(),
		competition: nil,
	}
	// add player to active players
	existingPlayers[conn] = &player

	log.Println("Initialized player", player.playerId, "with name", player.name)
	conn.WriteJSON(&WSResponse{
		Type: "initialized",
		PlayerData: PlayerData{
			PlayerId: player.playerId,
			Name:     player.name,
		},
	})
}

func joinWaitingRoom(player *Player) {
	// reset the player competition data
	if player.competition != nil {
		// disconnect the link between the player and the previous competition
		delete(player.competition.players, player.playerId)
		player.competition = nil
		log.Println("Player", player.name, "disconnected from previous competition")
	}

	waitingPlayers = append(waitingPlayers, player)
	log.Println("player", player.name, "joined waiting room")
	log.Println("Players in waitlist", len(waitingPlayers))

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

	playerMap := make(map[string]*Player, len(players))
	for _, player := range players {
		playerMap[player.playerId] = player
	}

	competition := Competition{
		id:                   competitionId,
		players:              playerMap,
		targetText:           []string{"Hello", "world"},
		hasCountDownFinished: false,
		playersData:          make(map[string]*PlayerData),
		capacity:             PLAYERS_PER_COMPETITION,
		activePlayers:        PLAYERS_PER_COMPETITION,
	}

	// initializing the playersData for the competition
	playersData := make(map[string]*PlayerData, len(players))
	for _, player := range players {
		playersData[player.playerId] = &PlayerData{
			PlayerId: player.playerId,
			Name:     player.name,
			Wpm:      0,
			Accuracy: 0,
			Ranking:  0,
		}

		// setting the player competition
		player.competition = &competition
	}

	competition.playersData = playersData

	log.Println("competition", competitionId)
	sendMessageToCompetition(&competition, &WSResponse{Type: "matchFound", PlayersData: *generatePlayersData(players), TargetText: competition.targetText})
	sendMessageToCompetition(&competition, &WSResponse{Type: "startCountdown"})

	// handle the countdown
	time.AfterFunc(COUNTDOWN_TIME*time.Second, func() {
		competition.hasCountDownFinished = true
	})
}

func removeCompetition(competition *Competition) {
	// this should deallocate the memory
	for _, player := range competition.players {
		player.competition = nil
	}

	log.Println("Competition", COMPETITION_ID, "deleted")
	COMPETITION_ID -= 1
}

func handleDisconnection(conn *websocket.Conn) {
	player := existingPlayers[conn]

	if player == nil {
		return
	}

	if player.competition != nil {
		delete(player.competition.players, player.playerId)
		log.Println("player", player.name, "disconnected")

		if len(player.competition.players) == 0 {
			removeCompetition(player.competition)
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
		log.Println("player", player.name, "disconnected and removed from waiting room")
	}

	// player is removed from the connection
	delete(existingPlayers, conn)
}

func updateProgress(player *Player, request *WSRequest) {
	player.competition.playersData[player.playerId].Progress = request.Progress

	response := WSResponse{
		Type: "progress",
		PlayerData: PlayerData{
			PlayerId: player.playerId,
			Progress: request.Progress,
		},
	}

	sendMessageToCompetition(player.competition, &response)
}

func playerFinished(player *Player, request *WSRequest) {

	competition := player.competition
	playerRanking := competition.capacity - competition.activePlayers + 1

	competition.playersData[player.playerId].Wpm = request.Wpm
	competition.playersData[player.playerId].Accuracy = request.Accuracy
	competition.playersData[player.playerId].Ranking = playerRanking

	sendMessageToCompetition(competition, &WSResponse{Type: "finished",
		PlayerData: PlayerData{
			PlayerId: player.playerId,
			Ranking:  playerRanking,
			Wpm:      request.Wpm,
			Accuracy: request.Accuracy,
		},
	})

	// if the first player has finished send a countdown message to the competition
	if competition.activePlayers == competition.capacity {
		sendMessageToCompetition(competition, &WSResponse{
			Type: "startTimeout",
		})

		// terminate the competition after the countdown
		time.AfterFunc(TIMEOUT_TIME*time.Second, func() {
			if len(competition.players) > 0 {
				sendMessageToCompetition(competition, &WSResponse{
					Type: "terminated",
				})
			}
		})
	}

	log.Println("Player", player.name, "finished the competition")

	player.competition.activePlayers -= 1

	if len(competition.players) == 0 {
		removeCompetition(competition)
	} else {
		log.Println("Players in competition", len(competition.players))
	}
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
			if websocket.IsCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure, websocket.CloseNoStatusReceived) {
				// player disconnected
				handleDisconnection(conn)
				return
			}
			// Handle other errors without disconnecting
			log.Println("Error reading JSON: ", err)
			continue
		}

		switch request.Type {
		case "initialize":
			if existingPlayers[conn] == nil {
				// player not initialized
				initializePlayer(&request, conn)
				player = existingPlayers[conn]
			} else {
				log.Println("Illegal access to initialize")
			}

		case "waitlist":
			if player != nil {
				joinWaitingRoom(player)
			} else {
				log.Println("Illegal access to waitlist, player not initialized")
			}

		case "progress":
			if player != nil && player.competition != nil {
				updateProgress(player, &request)
			} else {
				log.Println("Error, illegal access to progress")
			}

		case "finished":
			if player != nil && player.competition != nil {
				playerFinished(player, &request)
			} else {
				log.Println("Error, illegal access to finished")
			}

		}
	}
}

func main() {
	http.HandleFunc("/compete", handler)
	http.ListenAndServe(":8080", nil)
	fmt.Println("Server is running on port 8080")
}

func sendMessageToCompetition(competition *Competition, response *WSResponse) {
	for _, player := range competition.players {
		player.socket.WriteJSON(response)
	}
}

func sendWaitingRoomUpdate() {
	for _, player := range waitingPlayers {
		player.socket.WriteJSON(WSResponse{Type: "waiting", PlayersData: *generatePlayersData(waitingPlayers)})
	}
}

func generatePlayerName() string {
	nameGenerator := namegenerator.NewNameGenerator(time.Now().UnixNano())
	return nameGenerator.Generate()
}

func generatePlayersData(players []*Player) *[]PlayerData {
	playersData := make([]PlayerData, len(players))

	for i, player := range players {
		playersData[i] = PlayerData{
			PlayerId: player.playerId,
			Name:     player.name,
		}
	}
	return &playersData
}
