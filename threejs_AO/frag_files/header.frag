precision mediump float;
uniform vec2 resolution;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
uniform mat4 cameraWorldMatrix;
uniform mat4 cameraProjectionMatrixInverse;
const float EPS = 0.01;
const float OFFSET = EPS * 5.0;
//const vec3 lightDir = vec3( -0.48666426339228763, 0.8111071056538127, -0.3244428422615251 );
const vec3 lightDir = vec3( 0.0, 1.0, 0.0 );
const float matness = 0.4;

const int ITER = 80;
const float ITER_SHADOW = 128.0;

const float ISOVAL = 0.2;
const float step = 0.5;
float wavefunc( vec3 p );
vec3 wavefunc_d( vec3 p, float f );