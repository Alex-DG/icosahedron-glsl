uniform float time;
uniform float progress;
uniform sampler2D landscape;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 eyeVector;
float PI = 3.141592653589793238;
void main()	{

	// vec2 uv = vUv + 0.3*sin(vUv*50.);
	// vec2 uv = vec2(0.5,-0.5)*gl_FragCoord.xy/vec2(1000.);
	vec2 uv = gl_FragCoord.xy/vec2(1000.);

	vec3 X = dFdx(vNormal);
	vec3 Y = dFdy(vNormal);
	vec3 normal = normalize(cross(X,Y));

	vec3 refracted = refract(eyeVector,normal,1./3.);
	uv += refracted.xy;

	float diffuse = dot(normal,vec3(1.));
	vec4 t = texture2D(landscape,uv);

	gl_FragColor = t;

	// gl_FragColor = vec4(diffuse);
	// gl_FragColor = vec4(eyeVector,1.);
}