// Original shader author: poopsock
#ifdef GL_ES
precision lowp float;
#endif

uniform float time;
uniform vec2 resolution;

const float cell_amount = 2.0;

vec2 random(vec2 value){
    value = vec2( dot(value, vec2(127.1,311.7) ),
                  dot(value, vec2(269.5,183.3) ) );
    return -1.0 + 2.0 * fract(sin(value) * 43758.5453123);
}

float noise(vec2 uv) {
    vec2 _period = vec2(3.0);
    uv = uv * cell_amount;
    vec2 cMin = floor(uv);
    vec2 cMax = cMin + 1.0;
    vec2 uvFract = fract(uv);

    // mod() in GLSL already returns a positive result for a positive
    // divisor, even with negative inputs — no need for the extra wrap.
    cMin = mod(cMin, _period);
    cMax = mod(cMax, _period);

    vec2 blur = smoothstep(0.0, 1.0, uvFract);

    vec2 ll = random(vec2(cMin.x, cMin.y));
    vec2 lr = random(vec2(cMax.x, cMin.y));
    vec2 ul = random(vec2(cMin.x, cMax.y));
    vec2 ur = random(vec2(cMax.x, cMax.y));

    vec2 fraction = fract(uv);

    return mix( mix( dot( ll, fraction - vec2(0, 0) ),
                     dot( lr, fraction - vec2(1, 0) ), blur.x),
                mix( dot( ul, fraction - vec2(0, 1) ),
                     dot( ur, fraction - vec2(1, 1) ), blur.x), blur.y) * 0.8 + 0.5;
}

float fbm(vec2 uv) {
    float amplitude = 0.5;
    float frequency = 3.0;
    float value = 0.0;

    // octaves are how "detailed" the waves look.
    // less octaves makes for more bubbly-looking waves, while more makes them more defined.
    // 6 octaves is the sweet spot. any less and it starts to look too smooth.
    // upping the octaves too much has diminishing returns and a cost on performance,
    // so i wouldn't say going further than 6 is worth it.
    int octaves = 6;
    for(int i = 0; i < octaves; i++) {
        value += amplitude * noise(frequency * uv);
        amplitude *= 0.5;
        frequency *= 2.0;
    }

    return value;
}

vec2 polar(vec2 uv, vec2 center, float zoom, float repeat)
{
    vec2 dir = uv - center;
    float radius = length(dir) * 2.0;
    float angle = atan(dir.y, dir.x) * 1.0/(3.1416 * 2.0);
    return vec2(radius * zoom, angle * repeat);
}

void mainImage(out vec4 color, vec2 p)
{
    vec2 uv = (2. * p - resolution.xy) / resolution.y * 2.0;
    vec2 puv = polar(uv, vec2(0.), .5, 1.);

    if (puv.x < .4) {
        color = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }

    vec4 milkBlack = vec4(vec3(0.050980392156862744, 0.050980392156862744, 0.0784313725490196), 1.0);
    vec4 milkGrey = vec4(vec3(0.3215686274509804, 0.14901960784313725, 0.24313725490196078), 1.0);
    vec4 milkWhite = vec4(vec3(0.6745098039215687, 0.19607843137254902, 0.19607843137254902), 1.0);

    float n = fbm(puv + vec2(time * .2, 5. / puv.x * -.1) * .5);
    n = n*n * inversesqrt(puv.x) * .8;

    vec3 c = mix(mix(vec3(milkBlack), vec3(milkGrey), step(0.2, n)), vec3(milkWhite), step(0.25, n));

    color = vec4(c, 1.);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
