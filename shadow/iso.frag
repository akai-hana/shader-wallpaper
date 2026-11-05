// from hppz on shadertoy
#ifdef GL_ES
precision lowp float;
#endif

uniform float time;
uniform vec2 resolution;

int cell_amount = 1;
vec2 period = vec2(10., 10.);
float t = time / 10.;

vec3 milkBlack = vec3(0.050980392156862744, 0.050980392156862744, 0.0784313725490196);
vec3 milkGrey = vec3(0.3215686274509804, 0.14901960784313725, 0.24313725490196078);
vec3 milkWhite = vec3(0.6745098039215687, 0.19607843137254902, 0.19607843137254902);

vec2 modulo(vec2 divident, vec2 divisor){
	vec2 positiveDivident = mod(divident, divisor) + divisor;
	return mod(positiveDivident, divisor);
}

// random vector
vec3 hash33(vec3 p)
{
    p = p * mat3(1111, 222.2, 333.3, 
                 444.4, 555.5, 666.6, 
                 777.7, 888.8, 999.9);
    p = -1.0 + 2.0 * fract(sin(p) * 43758.5453);
    return sin(p * 3.141 + t);
}

float perlinNoiseLerp(float l, float r, float t)
{
    t = ((6.0 * t - 15.0) * t + 10.0) * t * t * t;
    return mix(l, r, t);
}

float perlin_noise(vec3 p)
{
    vec3 pi = floor(p);
    vec3 pf = fract(p);

    vec3 uvw = pf * pf * (3.0 - 2.0 * pf);

    float f000 = dot(hash33(pi + vec3(0.0, 0.0, 0.0)), pf - vec3(0.0, 0.0, 0.0));
    float f001 = dot(hash33(pi + vec3(0.0, 0.0, 1.0)), pf - vec3(0.0, 0.0, 1.0));
    float f010 = dot(hash33(pi + vec3(0.0, 1.0, 0.0)), pf - vec3(0.0, 1.0, 0.0));
    float f011 = dot(hash33(pi + vec3(0.0, 1.0, 1.0)), pf - vec3(0.0, 1.0, 1.0));
    float f100 = dot(hash33(pi + vec3(1.0, 0.0, 0.0)), pf - vec3(1.0, 0.0, 0.0));
    float f101 = dot(hash33(pi + vec3(1.0, 0.0, 1.0)), pf - vec3(1.0, 0.0, 1.0));
    float f110 = dot(hash33(pi + vec3(1.0, 1.0, 0.0)), pf - vec3(1.0, 1.0, 0.0));
    float f111 = dot(hash33(pi + vec3(1.0, 1.0, 1.0)), pf - vec3(1.0, 1.0, 1.0));

    float temp00 = perlinNoiseLerp(f000, f100, uvw.x);
    float temp01 = perlinNoiseLerp(f001, f101, uvw.x);
    float temp10 = perlinNoiseLerp(f010, f110, uvw.x);
    float temp11 = perlinNoiseLerp(f011, f111, uvw.x);

    float temp0 = perlinNoiseLerp(temp00, temp10, uvw.y);
    float temp1 = perlinNoiseLerp(temp01, temp11, uvw.y);

    float noiseValue = perlinNoiseLerp(temp0, temp1, uvw.z);

    return noiseValue = (noiseValue + 0.5) / 2.0;
}


float fbm( vec3 p )
{
   p *= 4.;
   float a = 1., r = 0., s=0.;
    
   for (int i=0; i<4; i++) {
     r += a*abs(perlin_noise(p)); s+= a; p *= 2.; a*=.5;
   }
    
    return r;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    vec3 p = vec3(uv.x,uv.y,1.0) * 0.2;

    vec3 color = milkBlack;

    float f = fbm(p);
    f = fract((f - t * 0.1) * 10.);
	f = floor(f + 0.1);
    if (f > 0.5) {
		color = milkWhite;
	}
	
	//color = vec3(1.) * f;

	fragColor = vec4(color, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
