(function() {
  /**
   * 提取图片数据
   */

  const WIDTH = 512;
  const HEIGHT = 512;

  const canvas1 = document.querySelector("#canvas1");
  const canvas2 = document.querySelector("#canvas2");
  const canvas3 = document.querySelector("#canvas3");
  const canvas4 = document.querySelector("#canvas4");

  ctx1 = canvas1.getContext("2d");
  ctx2 = canvas2.getContext("2d");
  ctx3 = canvas3.getContext("2d");
  ctx4 = canvas4.getContext("2d");

  const img = new Image();

  img.addEventListener("load", onImageLoad);

  img.src = "../img/dog.png";

  function onImageLoad() {
    let imageData1, imageData2, imageData3, imageData4;
    let arr1 = [];
    let arr2 = [];

    ctx1.drawImage(img, 0, 0, WIDTH, HEIGHT);

    imageData1 = ctx1.getImageData(0, 0, WIDTH, HEIGHT);

    // png具有四通道，jpg只有三通道，alpha通道的值均为255
    for (let i = 0; i < imageData1.data.length / 4; i++) {
      // 提取原始图片的r、g、b通道分别放在对应的通道，alpha通道存放255
      arr1.push(
        imageData1.data[i * 4],
        imageData1.data[i * 4 + 1],
        imageData1.data[i * 4 + 2],
        255
      );
      // 提取原始图片的alpha通道放在r通道，g通道与b通道存放0，alpha通道存放255
      arr2.push(imageData1.data[i * 4 + 3], 0, 0, 255);
    }

    // Uint8ClampedArray（8位无符号整型固定数组）
    // 类型化数组表示一个由值固定在0-255区间的8位无符号整型组成的数组
    imageData2 = new Uint8ClampedArray(arr1);
    imageData3 = new Uint8ClampedArray(arr2);
    imageData4 = new Uint8ClampedArray([...arr1, ...arr2]);

    // 提取的rgb通道
    ctx2.putImageData(new ImageData(imageData2, WIDTH, HEIGHT), 0, 0);

    // 提取的alpha通道
    ctx3.putImageData(new ImageData(imageData3, WIDTH, WIDTH), 0, 0);

    // 拼接而成的图片
    ctx4.putImageData(new ImageData(imageData4, WIDTH, 2 * HEIGHT), 0, 0);

    canvas4.addEventListener("click", function() {
      const link = document.createElement("a");

      link.href = this.toDataURL("image/jpeg", 1);
      link.download = "compressed.jpg";
      link.click();
    });
  }
})();
