uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
uniform vec2 pixels;
varying vec3 vNormal;
varying vec3 eyeVector;
float PI = 3.141592653589793238;
void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix*normal);

  vec3 newPosition = position;
  vec4 worldPosition = modelMatrix * vec4(newPosition, 1.0);
  eyeVector = normalize(worldPosition.xyz - cameraPosition);

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}