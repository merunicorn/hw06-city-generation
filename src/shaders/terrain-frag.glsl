#version 300 es
precision highp float;

uniform vec2 u_PlanePos; // Our location in the virtual world displayed by the plane

in vec3 fs_Pos;
in vec4 fs_Nor;
in vec4 fs_Col;

in float fs_Time;
in float fs_Water;

vec3 colorFxn(vec3 col) {
  return vec3(col / 255.0);
}

out vec4 out_Col; // This is the final output color that you will see on your
                  // screen for the pixel that is currently being processed.

void main()
{
    vec4 col_final = vec4(1.0);

    vec3 col_w = colorFxn(vec3(143.0, 178.0, 216.0));
    vec3 col_l = colorFxn(vec3(178.0, 222.0, 156.0));
    
    if (fs_Water == 1.0) {
        col_final = vec4(col_w, 1.0);
    }
    else if (fs_Water == 0.5) {
        col_final = vec4(mix(col_w, col_l, 0.5), 1.0);
    }
    else {
        col_final = vec4(col_l, 1.0);
    }

    vec3 col_a = colorFxn(vec3(100.0, 100.0, 100.0));

    out_Col = col_final;
}
