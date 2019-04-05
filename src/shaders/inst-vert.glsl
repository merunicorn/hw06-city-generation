#version 300 es

uniform mat4 u_ViewProj;
uniform float u_Time;

uniform mat3 u_CameraAxes; // Used for rendering particles as billboards (quads that are always looking at the camera)
// gl_Position = center + vs_Pos.x * camRight + vs_Pos.y * camUp;

in vec4 vs_Pos; // Non-instanced; each particle is the same quad drawn in a different place
// in vec4 vs_Nor; // Non-instanced, and presently unused
in vec4 vs_Col; // An instanced rendering attribute; each particle instance has a different color
// in vec2 vs_UV; // Non-instanced, and presently unused in main(). Feel free to use it for your meshes.
in vec4 vs_Transf1;
in vec4 vs_Transf2;
in vec4 vs_Transf3;
in vec4 vs_Transf4;

out vec4 fs_Col;
out vec4 fs_Pos;
out vec4 fs_Nor;

void main()
{
    fs_Col = vs_Col;
    if (vs_Col == vec4(0.0, 0.0, 0.0, 1.0)) {
        fs_Col = vec4(0.0, 0.0, 0.5, 1.0);
    }
    fs_Pos = vs_Pos;

    mat4 transf = mat4((vs_Transf1),(vs_Transf2),(vs_Transf3),(vs_Transf4));
    gl_Position = u_ViewProj * vs_Pos;
    gl_Position = u_ViewProj * transf * vs_Pos;
}
