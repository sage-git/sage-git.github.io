
const float ALPHA = 2.0;
float wavefunc( vec3 p ){
    float r = length(p);
    return exp( - r*r/ALPHA/ALPHA)*(2.0*p.z*p.z - p.x*p.x - p.y*p.y)/r/r;
}
vec3 wavefunc_d( vec3 p, float f ){
    float r = length(p);
    if ( r == 0.0 ){ return vec3(1.0, 0.0, 0.0); }
    float pexp = exp( - r*r/ALPHA/ALPHA);
    vec3 ret = vec3(- 2.0*p.x, -2.0*p.y, 4.0*p.z)*pexp/r/r - 2.0*f*p/r/r - 2.0*f*p/ALPHA/ALPHA;
    return ret;
}