import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  PlaneGeometry,
  MeshBasicMaterial,
  VideoTexture,
  Mesh,
  ShaderMaterial,
  Vector2,
} from "three";

const VERT = `
varying vec2 vUv; 

void main() {
  vUv = uv; 

  vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewPosition; 
}
`;
const FRAG = `
uniform sampler2D texture1;
uniform vec2 resolution;
varying vec2 vUv;

float warpAmount = 0.75;
float scan = 0.75;
float flicker = 1.0;
float blurSize = 1. / 512.;
float bloomIntensity = 0.3;

float warp(float value, float dc) {
  value -= 0.5; value *= 1.0+(dc*(0.3*warpAmount)); value += 0.5;
  return value;
}

void main() {
    // squared distance from center
    // vec2 uv = vUv/resolution.xy;
    vec2 uv = vUv;
    vec2 dc = abs(0.5-uv);
    dc *= dc;
    
    // warp the fragment coordinates
    uv.x = warp(uv.x, dc.y);
    uv.y = warp(uv.y, dc.x);
    // uv.x -= 0.5; uv.x *= 1.0+(dc.y*(0.3*warpAmount)); uv.x += 0.5;
    // uv.y -= 0.5; uv.y *= 1.0+(dc.x*(0.4*warpAmount)); uv.y += 0.5;

    // sample inside boundaries, otherwise set to black and return
    if (uv.y > 1.0 || uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0) {
      gl_FragColor = vec4(0.0,0.0,0.0,1.0);
      return;
    }

    vec4 color = vec4(0.0);

    // determine if we are drawing in a scanline
    float apply = abs(sin(vUv.y * resolution.y)*0.5*scan);
    // sample the texture
    color = vec4(mix(texture2D(texture1,uv).rgb,vec3(0.0),apply),1.0);

    // Bloom
    vec4 sum = vec4(0.0);
    sum += texture2D(texture1, vec2(warp(vUv.x - 4.0*blurSize, dc.y), uv.y)) * 0.05;
    sum += texture2D(texture1, vec2(warp(vUv.x - 3.0*blurSize, dc.y), uv.y)) * 0.09;
    sum += texture2D(texture1, vec2(warp(vUv.x - 2.0*blurSize, dc.y), uv.y)) * 0.12;
    sum += texture2D(texture1, vec2(warp(vUv.x - blurSize, dc.y), uv.y)) * 0.15;
    sum += texture2D(texture1, vec2(uv.x, uv.y)) * 0.16;
    sum += texture2D(texture1, vec2(warp(vUv.x + blurSize, dc.y), uv.y)) * 0.15;
    sum += texture2D(texture1, vec2(warp(vUv.x + 2.0*blurSize, dc.y), uv.y)) * 0.12;
    sum += texture2D(texture1, vec2(warp(vUv.x + 3.0*blurSize, dc.y), uv.y)) * 0.09;
    sum += texture2D(texture1, vec2(warp(vUv.x + 4.0*blurSize, dc.y), uv.y)) * 0.05;
	
	  // blur in y (vertical)
    // take nine samples, with the distance blurSize between them
    sum += texture2D(texture1, vec2(uv.x, warp(vUv.y - 4.0*blurSize, dc.x))) * 0.05;
    sum += texture2D(texture1, vec2(uv.x, warp(vUv.y - 3.0*blurSize, dc.x))) * 0.09;
    sum += texture2D(texture1, vec2(uv.x, warp(vUv.y - 2.0*blurSize, dc.x))) * 0.12;
    sum += texture2D(texture1, vec2(uv.x, warp(vUv.y - blurSize, dc.x))) * 0.15;
    sum += texture2D(texture1, vec2(uv.x, uv.y)) * 0.16;
    sum += texture2D(texture1, vec2(uv.x, warp(vUv.y + blurSize, dc.x))) * 0.15;
    sum += texture2D(texture1, vec2(uv.x, warp(vUv.y + 2.0*blurSize, dc.x))) * 0.12;
    sum += texture2D(texture1, vec2(uv.x, warp(vUv.y + 3.0*blurSize, dc.x))) * 0.09;
    sum += texture2D(texture1, vec2(uv.x, warp(vUv.y + 4.0*blurSize, dc.x))) * 0.05;
    // vec4 t = texture2D(texture1, vUv);

    gl_FragColor = sum * bloomIntensity + color;
}
`;

export default function crtVideo(video) {
  const scene = new Scene();

  const w = window.innerWidth;
  const h = window.innerHeight;
  const camera = new OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 1, 10);

  const renderer = new WebGLRenderer();
  renderer.setSize(w, h);

  document.body.appendChild(renderer.domElement);

  const videoAspectRatio = video.videoWidth / video.videoHeight;
  const width = Math.min(w, h);
  const height = width / videoAspectRatio;
  const geometry = new PlaneGeometry(width, height);
  const videoTexture = new VideoTexture(video);
  const crtMaterial = new ShaderMaterial({
    uniforms: {
      texture1: { value: videoTexture },
      resolution: { value: new Vector2(video.videoWidth, video.videoHeight) },
    },
    vertexShader: VERT,
    fragmentShader: FRAG,
  });
  const basicMaterial = new MeshBasicMaterial({ map: videoTexture });

  const plane = new Mesh(geometry, crtMaterial);
  scene.add(plane);

  camera.position.z = 5;

  const animate = function () {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };
  animate();

  const toggle = (active) => {
    plane.material = active ? crtMaterial : basicMaterial;
  };

  return toggle;
}
