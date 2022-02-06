const float FAREST = 30.0;
float sceneDist( vec3 p, float f, vec3 df, vec3 ray, out vec3 fog_color ) {
    float nearest = length(p);
    float dlen = length(df);
    fog_color = (f > 0.0)? vec3(1.0, 0.0, 0.0): vec3(0.0, 0.0, 1.0);
    float dr = clamp(step/(1.0 + dlen), EPS*2.0, step*2.0);
    fog_color = dr*fog_color*(f*f)*2.0;
    return dr;
}
vec3 sceneColor( vec3 p, float f, vec3 df ) {
    return vec3(0.3, 0.8, 0.9);
}
vec3 getNormal( vec3 p, float f, vec3 df ) {
    return p/length(p);
}

float getShadow( vec3 ro, vec3 rd, float f, vec3 df, out vec3 fog ) {
    float h = 0.0;
    float c = 0.0;
    float r = 1.0;
    float shadowCoef = 0.5;
    fog = vec3(0.0);
    for ( float t = 0.0; t< ITER_SHADOW; t++ ) {
        vec3 fog_i = vec3(0.0);
        h = sceneDist( ro + rd * c, f, df, rd, fog_i );
        fog += fog_i;
        if ( h < EPS ) return shadowCoef;
        r = min( r, h * 16.0 / (c + EPS));
        c += h;
    }
    return 1.0 - shadowCoef + r * shadowCoef;
}
vec3 getRayColor( vec3 origin, vec3 ray, out vec3 pos, out vec3 normal, out bool hit ) {
    // marching loop
    float dist = 1.0;
    float depth = 0.0;
    pos = origin;
    vec3 fog = vec3(0.0);
    float f = wavefunc(pos);
    for ( int i = 0; i < ITER; i++ ){
        f = wavefunc(pos);
        vec3 df = wavefunc_d(pos, f);
        vec3 fog_i = vec3(0.0);
        dist = sceneDist( pos, f, df, ray, fog_i );
        fog += fog_i;
        depth += dist;
        pos = origin + depth * ray;
        if ( abs(dist) < EPS || abs(depth) > FAREST) break;
    }
    // hit check and calc color
    vec3 color;
    const float matness = 1.0;

    if ( abs(dist) < EPS ) {
        float f = wavefunc(pos);
        vec3 df = wavefunc_d(pos, f);
        normal = getNormal( pos, f, df );
        float diffuse = clamp( dot( lightDir, normal ), 0.1, 1.0 );
        float specular = clamp( dot( reflect( lightDir, normal ), ray ), 0.0, 1.0 );
        //float shadow = getShadow( pos + normal * OFFSET, lightDir, f, df );
        //color = ( sceneColor( pos, f, df ) + vec3( 1.0 - matness ) * specular + vec3( matness) * diffuse ) * max( 0.5, shadow );
        color = ( sceneColor( pos, f, df ) + vec3( 1.0 - matness ) * specular + vec3( matness) * diffuse )*0.5;
        hit = true;
    } else {
        color = vec3( 0.4 );
    }
    return clamp(fog + color, 0.0, 1.0);// - pow( clamp( 0.05 * depth, 0.0, 0.6 ), 2.0 ) * 0.1;
}
void main(void) {
    // screen position
    vec2 screenPos = ( gl_FragCoord.xy * 2.0 - resolution ) / min( resolution.x, resolution.y );
    // convert ray direction from screen coordinate to world coordinate
    vec3 ray = (cameraWorldMatrix * cameraProjectionMatrixInverse * vec4( screenPos.xy, 1.0, 1.0 )).xyz;
    ray = normalize( ray );
    // camera position
    vec3 cPos = cameraPosition;
    // cast ray
    vec3 color = vec3( 0.0 );
    vec3 pos, normal;
    bool hit;
    float alpha = 1.0;
    for ( int i = 0; i < 3; i++ ) {
        color += alpha * getRayColor( cPos, ray, pos, normal, hit );
        alpha *= 0.3;
        ray = normalize( reflect( ray, normal ) );
        cPos = pos + normal * OFFSET;
        if ( !hit ) break;
    }
    gl_FragColor = vec4( color, 1.0 );
}