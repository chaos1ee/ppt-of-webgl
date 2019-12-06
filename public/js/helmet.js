(function() {
  var container, mesh;
  var camera, scene, renderer;

  init();
  animate();

  function init() {
    container = document.querySelector("#container");

    // 创建透视相机
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.25,
      20
    );
    camera.position.set(-1.1, 0.0, 4);

    // 创建场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf7f9fb);

    /**
     * 创建一个RGBELoader加载hdr图片
     * RGBE wiki: https://en.wikipedia.org/wiki/RGBE_image_format
     */
    new THREE.RGBELoader()
      .setDataType(THREE.UnsignedByteType)
      .setPath("textures/")
      .load("pedestrian_overpass_2k.hdr", function(texture) {
        var cubeGenerator = new THREE.EquirectangularToCubeGenerator(texture, {
          resolution: 1024
        });
        cubeGenerator.update(renderer);
        var pmremGenerator = new THREE.PMREMGenerator(
          cubeGenerator.renderTarget.texture
        );
        pmremGenerator.update(renderer);
        var pmremCubeUVPacker = new THREE.PMREMCubeUVPacker(
          pmremGenerator.cubeLods
        );
        pmremCubeUVPacker.update(renderer);
        var envMap = pmremCubeUVPacker.CubeUVRenderTarget.texture;
        // model
        var loader = new THREE.GLTFLoader().setPath(
          "models/DamagedHelmet/glTF/"
        );
        loader.load("DamagedHelmet.gltf", function(gltf) {
          gltf.scene.traverse(function(child) {
            if (child.isMesh) {
              child.material.envMap = envMap;
              mesh = child;
            }
          });
          scene.add(gltf.scene);
        });
        pmremGenerator.dispose();
        pmremCubeUVPacker.dispose();
      });

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.gammaOutput = true;
    container.appendChild(renderer.domElement);
    window.addEventListener("resize", onWindowResize, false);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    // 旋转动画
    if (mesh) {
      mesh.rotation.z -= 0.0025;
    }
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
})();
