<template>
  <div class="my-8 container m-auto text-xl">
    <h1 class="text-xl font-bold text-center">Paint</h1>
    <div class="flex justify-between">
      <div class="m-2">
        <label for="hs-color-input" class="block text-sm font-medium mb-2"
          >Color picker</label
        >
        <input
          id="hs-color-input"
          v-model="state.color"
          type="color"
          class="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none"
          title="Choose your color"
        />
      </div>
      <div class="m-2">
        <label for="hs-color-input" class="block text-sm font-medium mb-2"
          >Draw size</label
        >
        <input v-model="state.size" type="range" min="1" max="50" step="1" />
      </div>
    </div>
    <div>
      <div class="buttons mx-auto flex justify-between">
        <button type="primary" @click="changeType('huabi')">Draw</button>
        <button type="success" @click="changeType('rect')">Rectangle</button>
        <button
          type="warning"
          style="margin-right: 10px"
          @click="changeType('arc')"
        >
          Circle
        </button>
        <button @click="revert">Revert</button>
        <button @click="recovery">Recover</button>
        <button @click="clear">Clear</button>
        <button @click="saveImg">Save</button>
      </div>
      <canvas
        id="canvas"
        class="w-full"
        width="800"
        height="400"
        @mousedown="canvasDown"
        @mousemove="canvasMove"
        @mouseout="canvasUp('out')"
        @mouseup="canvasUp('up')"
      >
      </canvas>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive } from "vue";

  interface IState {
    type: string;
    isDraw: boolean;
    canvasDom?: HTMLCanvasElement | null;
    ctx?: CanvasRenderingContext2D | null;
    beginX: number;
    beginY: number;
    color: string;
    imageData: ImageData | null;
    size: number;
  }

  const state = reactive<IState>({
    type: "huabi",
    isDraw: false,
    beginX: 0,
    beginY: 0,
    color: "#000",
    imageData: null,
    size: 1,
  });

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let imageDataArr: string[] = [];
  let step = -1;

  onMounted(() => {
    canvas = document.getElementById("canvas") as HTMLCanvasElement;
    ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  });

  const changeType = (type: string) => {
    state.type = type;
  };
  const canvasDown = (e: MouseEvent) => {
    state.isDraw = true;
    state.beginX = e.pageX - canvas.offsetLeft;
    state.beginY = e.pageY - canvas.offsetTop;
  };
  const canvasMove = (e: MouseEvent) => {
    if (!state.isDraw) return;
    const x = e.pageX - canvas.offsetLeft;
    const y = e.pageY - canvas.offsetTop;
    switch (state.type) {
      case "huabi":
        huabiFn(ctx, x, y);
        break;
      case "rect":
        rectFn(ctx, x, y);
        break;
      case "arc":
        arcFn(ctx, x, y);
        break;
    }
  };
  const canvasUp = (type: string) => {
    if (type === "up") {
      step++;
      if (step < imageDataArr.length) {
        imageDataArr.length = step;
      }
      imageDataArr.push(canvas.toDataURL());
    }
    state.imageData = ctx.getImageData(0, 0, 800, 400);

    state.isDraw = false;
  };
  const huabiFn = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.beginPath();
    ctx.arc(x, y, state.size, 0, 2 * Math.PI);
    ctx.fillStyle = state.color;
    ctx.fill();
    ctx.closePath();
  };
  const rectFn = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const beginX = state.beginX;
    const beginY = state.beginY;
    ctx.clearRect(0, 0, 800, 400);
    state.imageData && ctx.putImageData(state.imageData, 0, 0, 0, 0, 800, 400);
    ctx.beginPath();
    ctx.strokeStyle = state.color;
    ctx.rect(beginX, beginY, x - beginX, y - beginY);
    ctx.lineWidth = state.size;
    ctx.stroke();
    ctx.closePath();
  };
  const arcFn = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const beginX = state.beginX;
    const beginY = state.beginY;
    state.isDraw && ctx.clearRect(0, 0, 800, 400);
    state.imageData && ctx.putImageData(state.imageData, 0, 0, 0, 0, 800, 400);
    ctx.beginPath();
    ctx.strokeStyle = state.color;
    ctx.arc(
      beginX,
      beginY,
      Math.round(
        Math.sqrt((x - beginX) * (x - beginX) + (y - beginY) * (y - beginY)),
      ),
      0,
      2 * Math.PI,
    );
    ctx.lineWidth = state.size;
    ctx.stroke();
    ctx.closePath();
  };
  const saveImg = () => {
    const url = canvas.toDataURL();
    const a = document.createElement("a");
    a.download = "sunshine";
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const clear = () => {
    state.imageData = null;
    ctx.clearRect(0, 0, 800, 400);
  };
  const revert = () => {
    if (step >= 0) {
      step--;
      ctx.clearRect(0, 0, 800, 400);
      let canvasPic = new Image();
      canvasPic.src = imageDataArr[step];
      canvasPic.addEventListener("load", () => {
        ctx.drawImage(canvasPic, 0, 0);
      });
    }
  };
  const recovery = () => {
    if (step < imageDataArr.length - 1) {
      step++;
      ctx.clearRect(0, 0, 800, 400);
      let canvasPic = new Image();
      canvasPic.src = imageDataArr[step];
      canvasPic.addEventListener("load", () => {
        ctx.drawImage(canvasPic, 0, 0);
      });
    }
  };
</script>

<style scoped>
  .buttons {
    margin-bottom: 10px;
    display: flex;
  }
  #canvas {
    border: 1px solid black;
  }
  button,
  color-picker {
    margin: 5px;
  }
</style>
