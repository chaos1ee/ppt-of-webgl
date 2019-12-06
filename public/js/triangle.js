(function() {
  main();
  // 创建着色器的方法
  function createShader(gl, type, source) {
    // 创建着色器对象
    const shader = gl.createShader(type);
    // 设置数据源
    gl.shaderSource(shader, source);
    // 编译着色器
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
    }

    // 清除着色器
    gl.deleteShader(shader);
  }

  function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return program;
    }

    gl.deleteProgram(program);
  }

  function main() {
    // 获取WebGL上下文
    const canvas = document.querySelector("#triangle");
    const gl = canvas.getContext("webgl");

    if (!gl) return;

    // 清空canvas
    gl.clearColor(255, 255, 255, 1);
    // 使用预设值来清空缓冲
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 顶点着色器片段
    const vertexShaderSource = `
      // 一个属性，将会从缓冲中获取数据
      attribute vec4 a_position;

      void main() {
        // gl_position是顶点着色器主要设置的变量
        gl_Position = a_position;
      }
    `;

    // 片段着色器片段
    const fragmentShaderSource = `
      // 设置片段着色器的精度
      precision mediump float;

      void main() {
        // gl_FragColor是片段着色器主要设置的变量
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
      }
    `;

    // 创建着色器
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);

    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    // 将两个着色器link到program
    const program = createProgram(gl, vertexShader, fragmentShader);

    // 告知WebGL使用program
    gl.useProgram(program);

    /**
     * 使用缓冲区对象向顶点着色器传递顶点数据
     */

    // 1.创建缓冲区对象
    const positionBuffer = gl.createBuffer();

    // 2.绑定缓冲区对象
    // 将positionBuffer绑定到ARRAY_BUFFER
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // 3.将数据写入缓冲区对象
    // prettier-ignore
    const positions = new Float32Array([
      0.0, 0.0, 
      0.0, 1.0, 
      1.0, 0.0,
    ]);

    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // 4.将缓冲区对象分配给一个attribute变量

    // 返回了给定WebGLProgram对象中“a_position”属性的下标指向位置
    const positionAttributeLocation = gl.getAttribLocation(
      program,
      "a_position"
    );

    // 告诉属性怎么从positionBuffer中读取数据（ARRAY_BUFFER)
    const size = 2; // 每次迭代运行提取两个单位数据
    const type = gl.FLOAT; // 每个单位的数据类型是32位浮点型
    const normalize = false; // 不需要归一化数据
    const stride = 0; // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)），每次迭代运行运动多少内存到下一个数据开始点
    const offset = 0; // 从缓冲起始位置开始读取

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
    gl.vertexAttribPointer(
      positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    // 5.开启attribu变量
    gl.enableVertexAttribArray(positionAttributeLocation);

    // 绘制
    const primitiveType = gl.TRIANGLES;
    const count = 3;

    gl.drawArrays(primitiveType, offset, count);
  }
})();
