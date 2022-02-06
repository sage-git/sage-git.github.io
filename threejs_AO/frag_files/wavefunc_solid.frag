float sceneDist( vec3 p, vec3 ray ) {
    float f = wavefunc(p);
    vec3 df = wavefunc_d(p, f);
    float nearest = length(p);
    float dlen = length(df);
    float angle = dot(df, ray);
    float dr = (ISOVAL - abs(f))/(0.5 + abs(angle));
    return dr;
}

vec3 sceneColor( vec3 p ) {
    float f = wavefunc(p);
    if( abs(abs(f) - ISOVAL) < EPS*2.0){
        return (f > 0.0)? vec3(1.0, 0.0, 0.0): vec3(0.0, 0.0, 1.0);
   }
   return vec3(0.0, 0.0, 0.0);
}

vec3 getNormal( vec3 p ) {
    float f = wavefunc(p);
    vec3 df = wavefunc_d(p, f);
    float len = length(df);
    return - sign(f)*df/len;
}
