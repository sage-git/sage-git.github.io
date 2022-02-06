const float ALPHA = 2.0;
float wavefunc( vec3 p ){
    float r = length(p);
    return exp( - r*r/ALPHA/ALPHA)*p.x/r;
}
vec3 wavefunc_d( vec3 p, float f ){
    float r = length(p);
    if ( r == 0.0 ){ return vec3(1.0, 0.0, 0.0); }
    float pexp = exp( - r*r/ALPHA/ALPHA);
    vec3 ret = vec3(r*r - p.x*p.x, - p.x*p.y, -p.x*p.z)/(r*r*r)*pexp - f*2.0*r*p/(ALPHA*ALPHA*r);
    return ret;
}