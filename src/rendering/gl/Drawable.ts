import {gl} from '../../globals';

abstract class Drawable {
  count: number = 0;

  bufIdx: WebGLBuffer;
  bufPos: WebGLBuffer;
  bufNor: WebGLBuffer;

  bufTransform1: WebGLBuffer;
  bufTransform2: WebGLBuffer;
  bufTransform3: WebGLBuffer;
  bufTransform4: WebGLBuffer;
  
  bufCol: WebGLBuffer;

  idxBound: boolean = false;
  posBound: boolean = false;
  norBound: boolean = false;
  colGenerated: boolean = false;
  
  t1Generated: boolean = false;
  t2Generated: boolean = false;
  t3Generated: boolean = false;
  t4Generated: boolean = false;
  

  numInstances: number = 0; // How many instances of this Drawable the shader program should draw

  abstract create() : void;

  destory() {
    gl.deleteBuffer(this.bufIdx);
    gl.deleteBuffer(this.bufPos);
    gl.deleteBuffer(this.bufNor);
    gl.deleteBuffer(this.bufCol);
    
    gl.deleteBuffer(this.bufTransform1);
    gl.deleteBuffer(this.bufTransform2);
    gl.deleteBuffer(this.bufTransform3);
    gl.deleteBuffer(this.bufTransform4);
  }

  generateIdx() {
    this.idxBound = true;
    this.bufIdx = gl.createBuffer();
  }

  generatePos() {
    this.posBound = true;
    this.bufPos = gl.createBuffer();
  }

  generateNor() {
    this.norBound = true;
    this.bufNor = gl.createBuffer();
  }

  generateCol() {
    this.colGenerated = true;
    this.bufCol = gl.createBuffer();
  }

  generateTransform1() {
    this.t1Generated = true;
    this.bufTransform1 = gl.createBuffer();
  }

  generateTransform2() {
    this.t2Generated = true;
    this.bufTransform2 = gl.createBuffer();
  }

  generateTransform3() {
    this.t3Generated = true;
    this.bufTransform3 = gl.createBuffer();
  }

  generateTransform4() {
    this.t4Generated = true;
    this.bufTransform4 = gl.createBuffer();
  }

  bindIdx(): boolean {
    if (this.idxBound) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    }
    return this.idxBound;
  }

  bindPos(): boolean {
    if (this.posBound) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    }
    return this.posBound;
  }

  bindNor(): boolean {
    if (this.norBound) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    }
    return this.norBound;
  }

  bindCol(): boolean {
    if (this.colGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
    }
    return this.colGenerated;
  }

  bindTransform1(): boolean {
    if (this.t1Generated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransform1);
    }
    return this.t1Generated;
  }

  bindTransform2(): boolean {
    if (this.t2Generated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransform2);
    }
    return this.t2Generated;
  }

  bindTransform3(): boolean {
    if (this.t3Generated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransform3);
    }
    return this.t3Generated;
  }

  bindTransform4(): boolean {
    if (this.t4Generated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransform4);
    }
    return this.t4Generated;
  }

  elemCount(): number {
    return this.count;
  }

  drawMode(): GLenum {
    return gl.TRIANGLES;
  }

  setNumInstances(num: number) {
    this.numInstances = num;
  }
};

export default Drawable;
