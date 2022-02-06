float getShadow( vec3 ro, vec3 rd ) {
    float h = 0.0;
    float c = 0.0;
    float r = 1.0;
    float shadowCoef = 0.5;
    for ( float t = 0.0; t< 50.0; t++ ) {
        h = sceneDist( ro + rd * c, rd );
        if ( h < EPS ) return shadowCoef;
        r = min( r, h * 16.0 / (c + EPS));
        c += h;
    }
    return 1.0 - shadowCoef + r * shadowCoef;
}
vec3 getRayColor( vec3 origin, vec3 ray, out vec3 pos, out vec3 normal, out bool hit ) {
    // marching loop
    float dist;
    float depth = 0.0;
    pos = origin;
    for ( int i = 0; i < 64; i++ ){
        dist = sceneDist( pos , ray);
        depth += dist;
        pos = origin + depth * ray;
        if ( abs(dist) < EPS ) break;
    }
    // hit check and calc color
    vec3 color;
    if ( abs(dist) < EPS ) {
        normal = getNormal( pos );
        float diffuse = clamp( dot( lightDir, normal ), 0.1, 1.0 );
        float specular = pow( clamp( dot( reflect( lightDir, normal ), ray ), 0.0, 1.0 ), 10.0 );
        float shadow = getShadow( pos + normal * OFFSET, lightDir );
        color = ( sceneColor( pos ) + vec3( 1.0 - matness ) * specular + vec3(matness)*diffuse ) * max( 0.5, shadow );
        hit = true;
    } else {
        color = vec3( 0.4 );
    }
    return color - pow( clamp( 0.05 * depth, 0.0, 0.6 ), 2.0 ) * 0.1;
}
void main(void) {
    vec2 screenPos = ( gl_FragCoord.xy * 2.0 - resolution ) / min( resolution.x, resolution.y );
    vec3 ray = (cameraWorldMatrix * cameraProjectionMatrixInverse * vec4( screenPos.xy, 1.0, 1.0 )).xyz;
    ray = normalize( ray );
    vec3 cPos = cameraPosition;
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