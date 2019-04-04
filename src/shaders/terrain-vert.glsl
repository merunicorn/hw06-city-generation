#version 300 es


uniform mat4 u_Model;
uniform mat4 u_ModelInvTr;
uniform mat4 u_ViewProj;
uniform vec2 u_PlanePos; // Our location in the virtual world displayed by the plane
uniform int u_Time;
uniform int u_Anim;

in vec4 vs_Pos;
in vec4 vs_Nor;
in vec4 vs_Col;

out vec3 fs_Pos;
out vec4 fs_Nor;
out vec4 fs_Col;

out float fs_Time;
out float fs_Water;

float random1( vec2 p , vec2 seed) {
  return fract(sin(dot(p + seed, vec2(127.1, 311.7))) * 43758.5453);
}

float random1( vec3 p , vec3 seed) {
  return fract(sin(dot(p + seed, vec3(987.654, 123.456, 531.975))) * 85734.3545);
}

vec2 random2( vec2 p , vec2 seed) {
  return fract(sin(vec2(dot(p + seed, vec2(311.7, 127.1)), dot(p + seed, vec2(269.5, 183.3)))) * 85734.3545);
}

//Smoothstep (Adam's code)
vec2 mySmoothStep(vec2 a, vec2 b, float t) {
    t = smoothstep(0.0, 1.0, t);
    return mix(a, b, t);
}

//2d Noise (Adam's code)
vec2 interpNoise2D(vec2 uv) {
    vec2 uvFract = fract(uv);
    vec2 ll = random2(floor(uv), vec2(10.0)); //need to input seeds
    vec2 lr = random2(floor(uv) + vec2(1,0), vec2(10.0));
    vec2 ul = random2(floor(uv) + vec2(0,1), vec2(10.0));
    vec2 ur = random2(floor(uv) + vec2(1,1), vec2(10.0));

    vec2 lerpXL = mySmoothStep(ll, lr, uvFract.x);
    vec2 lerpXU = mySmoothStep(ul, ur, uvFract.x);

    return mySmoothStep(lerpXL, lerpXU, uvFract.y);
}

//FBM (Adam's base code)
vec2 fbm(vec2 uv) {
    float amp = 20.0;
    float freq = 1.0;
    vec2 sum = vec2(0.0);
    float maxSum = 0.0;
    int octaves = 10; //can modify
    for(int i = 0; i < octaves; i++) {
        sum += interpNoise2D(uv * freq) * amp;
        maxSum += amp;
        amp *= 0.5;
        freq *= 2.0;
    }
    return sum / maxSum;
}

//Worley Noise (Adam's code)
float WorleyNoise(vec2 uv, int j)
{
    // Tile the space
    vec2 uvInt = floor(uv);
    vec2 uvFract = fract(uv);

    float minDist = 1.0; // Minimum distance initialized to max.

    // Search all neighboring cells and this cell for their point
    for(int y = -1; y <= 1; y++) {
        for(int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));

            // Random point inside current neighboring cell
            vec2 point = random2(uvInt + neighbor, vec2(10.0));

            // Compute the distance b/t the point and the fragment
            // Store the min dist thus far
            vec2 diff = neighbor + point - uvFract;
            float dist = length(diff);
            minDist = min(minDist, dist);
        }
    }
    return minDist;
}

vec3 colorFxn(vec3 col) {
  return vec3(col / 255.0);
}

void main()
{
  fs_Pos = vs_Pos.xyz;

  fs_Time = float(u_Time);

  // terrain code from hw5
  vec2 st = (vs_Pos.xz + 1.0) / 2.0;
  float fbmn = fbm(st).x;
  float worley = WorleyNoise(vs_Pos.xz, 0);
  float worley2 = WorleyNoise(fbm(vs_Pos.zx), 0);

  worley2 /= fbmn * 2.8;
  worley2 += worley / 5.0;

  fbmn = clamp(fbmn, 0.0, 1.0);

  worley2 = 1.0 - worley2;
  worley2 = clamp(worley2, 0.0, 1.0);
  
  vec4 modelposition = vec4(0.0, 0.0, 0.0, 1.0);
  if (worley2 < 0.3) {
    // water
    modelposition = vec4(vs_Pos.x, 0.0, vs_Pos.z, 1.0);
    fs_Water = 1.0;
  }
  else if (worley2 < 0.5) {
    // slope
    fs_Water = 0.5;
    float diff = 0.5 - worley2; // 0.0 to 0.2
    modelposition = vec4(vs_Pos.x, 0.5 - (diff/0.5), vs_Pos.z, 1.0);
  }
  else {
    // land
    modelposition = vec4(vs_Pos.x, 0.5, vs_Pos.z, 1.0);
    fs_Water = 0.0;
  }
  modelposition = u_Model * modelposition;
  gl_Position = u_ViewProj * modelposition;
}
