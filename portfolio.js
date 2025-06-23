const canvas = document.getElementById('fluid-canvas');
const gl = canvas.getContext('webgl');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Shader setup (simple colorful plasma effect)
const vertShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertShader, `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`);
gl.compileShader(vertShader);

const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragShader, `
  precision mediump float;
  uniform float time;
  uniform vec2 resolution;
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 col = 0.5 + 0.5*cos(time + uv.xyx + vec3(0,2,4));
    gl_FragColor = vec4(col, 1.0);
  }
`);
gl.compileShader(fragShader);

// Create program
const program = gl.createProgram();
gl.attachShader(program, vertShader);
gl.attachShader(program, fragShader);
gl.linkProgram(program);
gl.useProgram(program);

// Set up vertices
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  -1, -1, 1, -1, -1, 1,
  -1, 1, 1, -1, 1, 1
]), gl.STATIC_DRAW);

const pos = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(pos);
gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

// Set uniform locations
const timeLoc = gl.getUniformLocation(program, 'time');
const resLoc = gl.getUniformLocation(program, 'resolution');

let start = performance.now();
function render(now) {
  let t = (now - start) * 0.001;
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform1f(timeLoc, t);
  gl.uniform2f(resLoc, canvas.width, canvas.height);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  requestAnimationFrame(render);
}
render();

// ⏱️ Hide canvas after 3 seconds
setTimeout(() => {
  canvas.style.transition = "opacity 0.5s ease";
  canvas.style.opacity = "0";
  setTimeout(() => {
    canvas.style.display = "none";
    document.getElementById('main-site').style.display = "block";
  }, 500);
}, 3000);

