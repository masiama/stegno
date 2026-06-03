const BITS_PER_CHAR = 16;
const SPACE = "0".repeat(BITS_PER_CHAR);
const END = "1".repeat(BITS_PER_CHAR);
const MESSAGE_END = SPACE + END;

const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });

const stob = (str: string) =>
  Array.from(segmenter.segment(str))
    .map(({ segment }) => segment.charCodeAt(0).toString(2).padStart(BITS_PER_CHAR, "0"))
    .join(SPACE) + MESSAGE_END;

const btos = (bits: string) =>
  bits
    .match(new RegExp(`.{1,${BITS_PER_CHAR}}`, "g"))
    ?.filter((byte) => byte !== SPACE && byte !== END)
    .map((byte) => String.fromCharCode(parseInt(byte, 2)))
    .join("") ?? "";

const prepareCanvas = (
  img: HTMLImageElement,
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } => {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context. Please try again.");
  ctx.drawImage(img, 0, 0);
  return { canvas, ctx };
};

const getXYChannel = (index: number, width: number) => {
  const x = Math.floor(index / 3) % width;
  const y = Math.floor(index / 3 / width);
  const channel = index % 3;
  return { x, y, channel };
};

export const readFile = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Error reading the file. Please try again."));
    reader.readAsDataURL(file);
  });

export const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error("Error loading the image. Please ensure it's a valid image file."));
    img.src = src;
  });

export const writeMessage = (message: string, fileName: string) => (img: HTMLImageElement) => {
  const { canvas, ctx } = prepareCanvas(img);

  const encodedMessage = stob(message);
  const maxMessageLength = canvas.width * canvas.height * 3;
  if (encodedMessage.length > maxMessageLength) {
    throw new Error(
      `Message is too long to encode in this image. Max length: ${maxMessageLength} bits.`,
    );
  }

  for (let i = 0; i < encodedMessage.length; i++) {
    const bit = +encodedMessage[i];
    const { x, y, channel } = getXYChannel(i, canvas.width);
    const imageData = ctx.getImageData(x, y, 1, 1);
    const pixel = imageData.data[channel];
    const newPixel = (pixel & ~1) | bit;
    imageData.data[channel] = newPixel;
    ctx.putImageData(imageData, x, y);
  }

  const link = document.createElement("a");
  link.download = fileName;
  link.href = canvas.toDataURL();
  link.click();
};

export const readMessage = (img: HTMLImageElement): string => {
  const { canvas, ctx } = prepareCanvas(img);

  let bits = "";
  while (bits.endsWith(MESSAGE_END) === false) {
    const i = bits.length;
    const { x, y, channel } = getXYChannel(i, canvas.width);
    const imageData = ctx.getImageData(x, y, 1, 1);
    const pixel = imageData.data[channel];
    bits += (pixel & 1).toString();
  }
  return btos(bits);
};
