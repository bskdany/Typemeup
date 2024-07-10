
import { Chart, type Point } from 'chart.js';

function getPoint(chart: Chart, index: number): { dataset: number, index: number } | null {
  for (let i = 0; i < chart.data.datasets.length; i++) {
    const pointArr = chart.data.datasets[i].data;

    // binary search the target
    let low = 0;
    let high = pointArr.length - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const point = pointArr[mid];

      if (point !== null && typeof point === "object" && 'x' in point) {
        if (point.x === index) {
          return { dataset: i, index: mid };
        } else if (point.x < index) {
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      } else {
        break;
      }
    }
  }
  return null;
}

export const customHighlightPlugin = {
  id: 'customHighlight',
  afterDatasetsDraw: (chart: Chart, args: any, options: { index: number }) => {

    const pointCoordinates = getPoint(chart, options.index);
    if (pointCoordinates) {
      const meta = chart.getDatasetMeta(pointCoordinates.dataset);
      const point = meta.data[pointCoordinates.index]
      const ctx = chart.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }
  }
}