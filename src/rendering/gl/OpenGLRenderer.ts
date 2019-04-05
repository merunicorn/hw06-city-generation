import {mat4, vec4, vec3} from 'gl-matrix';
import Drawable from './Drawable';
import Camera from '../../Camera';
import {gl} from '../../globals';
import ShaderProgram from './ShaderProgram';

// In this file, `gl` is accessible because it is imported above
class OpenGLRenderer {

  instBool: boolean;

  constructor(public canvas: HTMLCanvasElement) {
  }

  setClearColor(r: number, g: number, b: number, a: number) {
    gl.clearColor(r, g, b, a);
  }

  setSize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  clear() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  render(camera: Camera, prog: ShaderProgram, drawables: Array<Drawable>,
         grid: boolean, time: number, anim: boolean) {
    let model = mat4.create();
    let viewProj = mat4.create();
    //let color = vec4.fromValues(1, 0, 0, 1);

    mat4.identity(model);
    mat4.multiply(viewProj, camera.projectionMatrix, camera.viewMatrix);
    prog.setModelMatrix(model);
    prog.setViewProjMatrix(viewProj);
    if (anim) {
      prog.setAnim(1);
    }
    else {
      prog.setAnim(0);
    }
    prog.setTime(time);
    if (grid) {
      prog.setGridColor(1);
      this.instBool = true;
    }
    else {
      prog.setGridColor(0);
      this.instBool = false;
    }
    
    for (let drawable of drawables) {
      prog.draw(drawable);
    }
  }

  irender(camera: Camera, prog: ShaderProgram, drawables: Array<Drawable>,
    grid: boolean, time: number, anim: boolean) {
    let model = mat4.create();
    let viewProj = mat4.create();
    //let color = vec4.fromValues(1, 0, 0, 1);

    mat4.identity(model);
    mat4.multiply(viewProj, camera.projectionMatrix, camera.viewMatrix);
    prog.setModelMatrix(model);
    prog.setViewProjMatrix(viewProj);

    if (anim) {
      prog.setAnim(1);
    }
    else {
      prog.setAnim(0);
    }
    prog.setTime(time);
    if (grid) {
      prog.setGridColor(1);
      this.instBool = true;
    }
    else {
      prog.setGridColor(0);
      this.instBool = false;
    }

    for (let drawable of drawables) {
      prog.idraw(drawable);
    }
  }
};

export default OpenGLRenderer;
