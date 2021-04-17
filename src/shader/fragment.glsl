uniform float time;
uniform float progress;
uniform sampler2D landscape;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vNormal;
float PI = 3.141592653589793238;
void main()	{
	// vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
	float diffuse = dot(vNormal,vec3(1.));
	vec4 t = texture2D(landscape, vUv);
	// gl_FragColor = vec4(vUv,0.0,1.);
	gl_FragColor = t;
	gl_FragColor = vec4(diffuse);
}