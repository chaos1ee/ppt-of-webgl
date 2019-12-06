(function() {
  var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec2 a_TexCoord;
    varying vec2 v_TexCoord;

    void main() {
      gl_Position = a_Position;
      v_TexCoord = a_TexCoord;
    }
  `;

  // Fragment shader program
  var FSHADER_SOURCE = `
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform sampler2D u_Sampler;
    varying vec2 v_TexCoord;

    void main() {
      gl_FragColor = texture2D(u_Sampler, v_TexCoord);
    }
  `;

  function main() {
    var canvas = document.getElementById("texture1");

    var gl = getWebGLContext(canvas);

    if (!gl) {
      console.log("Failed to get the rendering context for WebGL");
      return;
    }

    // 初始化shader
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

    // 设置顶点信息
    var n = initVertexBuffers(gl);

    // 设置清除颜色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // 设置纹理
    if (!initTextures(gl, n)) {
      console.log("Failed to intialize the texture.");
      return;
    }
  }

  function initVertexBuffers(gl) {
    // prettier-ignore
    var verticesTexCoords = new Float32Array([
      // 顶点坐标  纹理坐标
      -0.5,  0.5,  0.0, 1.0,
      -0.5, -0.5,  0.0, 0.0,
       0.5,  0.5,  1.0, 1.0,
       0.5, -0.5,  1.0, 0.0
    ]);

    var n = 4; // 顶点数

    // 创建缓冲
    var vertexTexCoordBuffer = gl.createBuffer();
    if (!vertexTexCoordBuffer) {
      console.log("Failed to create the buffer object");
      return -1;
    }

    // 将数据保存到缓冲
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

    // TypedArray.BYTES_PER_ELEMENT 属性代表了强类型数组中每个元素所占用的字节数。
    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

    // 获取“a_position”的索引
    var a_Position = gl.getAttribLocation(gl.program, "a_Position");

    /**
     *  vertexAttribPointer()方法绑定当前缓冲区范围到gl.ARRAY_BUFFER
     * 成为当前顶点缓冲区对象的通用顶点属性并指定它的布局(缓冲区对象中的偏移量)。
     *
     * index 指定要修改的顶点属性的索引
     * 可以在编译顶点着色器时使用显卡分配的索引，此时必须调用gl.getAttribLocation（）
     * 然后将此索引提供给gl.vertexAttribPointer（）
     *
     * size 指定每个顶点属性的组成数量
     *
     * type 指定数组中每个元素的数据类型可能是
     *
     * normalized 当转换为浮点数时是否应该将整数数值归一化到特定的范围
     *
     * stride 以字节为单位指定连续顶点属性开始之间的偏移量(即数组中一行长度)。
     *
     * 如果stride为0，则假定该属性是紧密打包的，即不交错属性，每个属性在一个单独的块中，下一个顶点的属性紧跟当前顶点之后。
     *
     * offset 指定顶点属性数组中第一部分的字节偏移量
     */

    // 从索引为0的位置开始取坐标，每个坐标有2个值，不归一化数值，然后每取到一个坐标再间隔4个值取下一个坐标
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    // 开启指派buffer对象给变量
    gl.enableVertexAttribArray(a_Position);

    // 将缓冲中的纹理坐标分配给“a_TexCoord”
    var a_TexCoord = gl.getAttribLocation(gl.program, "a_TexCoord");

    // 从索引为2的位置开始取坐标，每个坐标有2个值，不归一化数值，然后每取到一个坐标再间隔4个值取下一个坐标
    gl.vertexAttribPointer(
      a_TexCoord,
      2,
      gl.FLOAT,
      false,
      FSIZE * 4,
      FSIZE * 2
    );

    // 开启指派buffer对象给变量
    gl.enableVertexAttribArray(a_TexCoord);

    return n;
  }

  function initTextures(gl, n) {
    var texture = gl.createTexture();

    // 获取“u_Sampler”的索引
    var u_Sampler = gl.getUniformLocation(gl.program, "u_Sampler");

    var image = new Image();

    image.onload = function() {
      loadTexture(gl, n, texture, u_Sampler, image);
    };

    image.src = "../img/sky.jpg";

    return true;
  }

  function loadTexture(gl, n, texture, u_Sampler, image) {
    // 旋转图片的Y轴
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // 开启0号纹理单元
    gl.activeTexture(gl.TEXTURE0);
    // 将纹理对象绑定到目标上
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // 设置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // 设置纹理图片
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    // 将0号纹理单元传递给着色器中的取样器变量
    gl.uniform1i(u_Sampler, 0);

    gl.clear(gl.COLOR_BUFFER_BIT);
    // gl.TRIANGLE_STRIP 绘制三角带
    // first 制定从哪个点开始绘制
    // count 制定绘制的点数
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
  }

  main();
})();
