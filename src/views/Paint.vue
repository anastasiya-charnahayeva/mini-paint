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
      <div class="buttons text-sm mx-auto flex justify-between mt-4">
        <button
          class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-800 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
          type="primary"
          @click="changeType('huabi')"
        >
          Draw
        </button>
        <button
          class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-800 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
          type="success"
          @click="changeType('rect')"
        >
          Rectangle
        </button>
        <button
          class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-800 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
          type="warning"
          style="margin-right: 10px"
          @click="changeType('arc')"
        >
          Circle
        </button>
        <button
          class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-800 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
          @click="revert"
        >
          Revert
        </button>
        <button
          class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-800 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
          @click="recovery"
        >
          Recover
        </button>
        <button
          class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-800 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
          @click="clear"
        >
          Clear
        </button>
        <button
          class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-800 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
          @click="saveImg"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive } from "vue";
  import { store } from "../firebase/index";
  import { useImagesStore } from "../stores/modules/images";

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
    const { left, top } = e.target.getBoundingClientRect();
    state.isDraw = true;
    state.beginX = e.pageX - left;
    state.beginY = e.pageY - top;
  };

  const canvasMove = (e: MouseEvent) => {
    if (!state.isDraw) return;
    const x = e.pageX - canvas.offsetLeft;
    const y = e.pageY - canvas.offsetTop;
    switch (state.type) {
      case "huabi":
        lineDrawing(ctx, x, y);
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
      state.beginX = canvas.offsetLeft;
      state.beginY = canvas.offsetTop;
      step++;
      if (step < imageDataArr.length) {
        imageDataArr.length = step;
      }
      imageDataArr.push(canvas.toDataURL());
    }
    state.imageData = ctx.getImageData(0, 0, 800, 400);

    state.isDraw = false;
  };

  let hue = 0;

  const lineDrawing = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.beginPath();
    ctx.linejoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = state.color;
    ctx.moveTo(state.beginX, state.beginY);
    ctx.lineTo(x, y);
    ctx.lineWidth = state.size;
    ctx.stroke();
    state.beginX = x;
    state.beginY = y;
    hue++;
    if (hue >= 360) {
      hue = 0;
    }
  };
  const rectFn = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const { beginX, beginY } = state;
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
    const { beginX, beginY } = state;
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
  const saveImg = async () => {
    const url = canvas.toDataURL();
    const imagesStore = useImagesStore();
    const { addImage } = imagesStore;
    await addImage(url);
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
