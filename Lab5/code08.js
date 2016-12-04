
//////////////////////////////////////////////////////////////////

var gl;
var shaderProgram;
var draw_type=2;


// set up the parameters for lighting 
var light_ambient = [1,1,1,1]; 
var light_diffuse = [.8,.8,.8,1];
var light_specular = [1,1,1,1]; 
var light_x = 0;
var light_y = 0;
var light_z = 0;
var light_pos = [light_x,light_y,light_z,1];   // eye space position 

var mat_ambient = [0.4, 0.4, 0.4, 1]; 
var mat_diffuse= [1, 1, 0, 1]; 
var mat_specular = [.8, .8, .8,1]; 
var mat_shine = [50]; 

//////////// Init OpenGL Context etc. ///////////////

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

var sphere;
var sylinder;
var cube;
var wheel;
var cannon;
var ground;
var cube_up;
var cube_faces = [];

function initBuffers() {
    ground = new Plane(1, [0.2, 0.1, 0.13, 1.0]);
    // sphere = new Sphere(0.4, 16, 16, [0.3, 0.6, 0.1, 1.0]);
    sphere = new Sphere(4, 16, 16, [0.3, 0.6, 0.1, 1.0]);
    sylinder = new Sylinder(1, 1.5, 1.5, 6, 6, [0.3, 0.6, 0.1, 1.0]);
    cube = new Cube(1);
    // wheel = new Sylinder(0.5, 0.5, 1, 12, 12, [0.3, 1, 0.3, 1.0]);
    // cannon = new Sylinder(0.5, 0.5, 1, 12, 12, [0.3, 1, 0.3, 1.0]);
    var textureCoords = [
        0.0, 1.0, 
        0.0, 0.0, 
        1.0, 0.0, 
        1.0, 1.0
    ];
    for (var i = 0; i < 6; i++) {
        var cube_face = new Plane(1, [0.2, 0.1, 0.13, 1.0]);
        // cube_face.vertexTextureCoordBuffer = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, cube_face.vertexTextureCoordBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
        // cube_face.vertexTextureCoordBuffer.itemSize = 2;
        // cube_face.vertexTextureCoordBuffer.numItems = 4;
        cube_face.texture = textures[i];
        cube_faces.push(cube_face);
    }
}

 var rPyramid = 0;
    var rsylinder = 0;
    var camPos = [0, 4, 8];
    var camTar = [0, 0, 0];
    var camUp = [0, 1, 0];
    var panDegree = 0;
    function moveCam(i, m) {
        if (i == "pos") {
            for (var i = 0; i < m.length; i++) {
                camPos[i] += m[i] / 10;
            }
        }
        if (i == "tar") {
            for (var i = 0; i < m.length; i++) {
                camTar[i] += m[i] / 10;
            }
        }
        if (i == "pan") {
            var panRad = degToRad(panDegree + 5);
            var x = camUp[0];
            var y = camUp[1];
            camUp[0] = x * Math.cos(panRad) - y * Math.sin(panRad);
            camUp[1] = y * Math.cos(panRad) + x * Math.sin(panRad);
        }
    }

function drawEnvironmentElement(obj) {
    setEnvironmentTexture(obj);
    drawElement(obj);
}

function drawObject(obj) {
    gl.uniform1i(shaderProgram.shouldDrawObject, true);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemapTexture);//cfdtlee
    gl.uniform1i(shaderProgram.cubeMapSampler, 1);
    // bind texture coord
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, obj.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
    drawElement(obj);
}

function setEnvironmentTexture(obj) {
    gl.uniform1i(shaderProgram.shouldDrawObject, false);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, obj.texture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);
    // bind texture coord
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, obj.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
}

function drawElement(obj) {
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, obj.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, obj.vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, obj.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.vertexIndexBuffer); 

    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, obj.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}


var cubemapTexture;

function initCubeMap() {
    cubemapTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemapTexture);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.REPEAT); 
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.REPEAT);
    // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR); 

    var cubeFaces = [
        ["cube_right.png", gl.TEXTURE_CUBE_MAP_POSITIVE_X],
        ["cube_left.png", gl.TEXTURE_CUBE_MAP_NEGATIVE_X],
        ["cube_up_1.png", gl.TEXTURE_CUBE_MAP_POSITIVE_Y],
        ["cube_down.png", gl.TEXTURE_CUBE_MAP_NEGATIVE_Y],
        ["cube_back.png", gl.TEXTURE_CUBE_MAP_POSITIVE_Z],
        ["cube_front.png", gl.TEXTURE_CUBE_MAP_NEGATIVE_Z]
    ];

    for (var i = 0; i < cubeFaces.length; i++) {
        var image = new Image();
        image.src = cubeFaces[i][0];
        image.onload = function(texture, face, image) {
            return function() {
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture)
                gl.texImage2D(face, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
            }
        } (cubemapTexture, cubeFaces[i][1], image);
    }
}

// function initCubeMap() {
//     cubemapTexture = gl.createTexture();
//     cubemapTexture.image = new Image();
//     cubemapTexture.image.onload = function() { handleCubemapTextureLoaded(cubemapTexture); }
//     cubemapTexture.image.src = "cube_up.png";
// //    cubemapTexture.image.src = "earth.png";        
//     console.log("loading cubemap texture....") 
// }    

function handleCubemapTextureLoaded(texture) {
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.REPEAT); 
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.REPEAT);
    // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR); 

    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
          texture.image);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
          texture.image);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
          texture.image);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
          texture.image);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
          texture.image);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
          texture.image);    
    console.log("after loading cubemap texture....") 
}    

function handleLoadedTexture(texture) {
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

var textures = [];
var imageList = ["cube_up_1.png", "cube_down.png", "cube_left.png", "cube_right.png", "cube_front.png", "cube_back.png"];
var t1, t2, t3, t4, t5, t6;
function initTexture() {
    // for (var i = 0; i < imageList.length; i++) {
    //     textures[i] = gl.createTexture();
    //     textures[i].image = new Image();
    //     textures[i].image.onload = function () {
    //         handleLoadedTexture(textures[i]);
    //     }
    //     textures[i].image.src = imageList[i];
    // }
    // imageList.forEach(function)
    t1 = gl.createTexture();
    t1.image = new Image();
    t1.image.onload = function () {
        handleLoadedTexture(t1)
    }
    t1.image.src = imageList[0];
    textures.push(t1);

    t2 = gl.createTexture();
    t2.image = new Image();
    t2.image.onload = function () {
        handleLoadedTexture(t2)
    }
    t2.image.src = imageList[1];
    textures.push(t2);

    t3 = gl.createTexture();
    t3.image = new Image();
    t3.image.onload = function () {
        handleLoadedTexture(t3)
    }
    t3.image.src = imageList[2];
    textures.push(t3);

    t4 = gl.createTexture();
    t4.image = new Image();
    t4.image.onload = function () {
        handleLoadedTexture(t4)
    }
    t4.image.src = imageList[3];
    textures.push(t4);

    t5 = gl.createTexture();
    t5.image = new Image();
    t5.image.onload = function () {
        handleLoadedTexture(t5)
    }
    t5.image.src = imageList[4];
    textures.push(t5);

    t6 = gl.createTexture();
    t6.image = new Image();
    t6.image.onload = function () {
        handleLoadedTexture(t6)
    }
    t6.image.src = imageList[5];
    textures.push(t6);
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

var mMatrix = mat4.create();  // model matrix
var vMatrix = mat4.create(); // view matrix
var pMatrix = mat4.create();  //projection matrix
var nMatrix = mat4.create();  // normal matrix
var v2wMatrix = mat4.create();
var Z_angle = .0;

var mMatrixStack = [];

function mvPushMatrix() {
    var copy = mat4.create();
    mat4.set(mMatrix, copy);
    mMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mMatrix = mMatrixStack.pop();
}

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, mMatrix);
    gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, vMatrix);
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);

    // mat4.multiply(mMatrix, sceneChangeMatrix);

    mat4.identity(v2wMatrix);
    v2wMatrix = mat4.multiply(v2wMatrix, vMatrix);
    v2wMatrix = mat4.transpose(v2wMatrix);
    gl.uniformMatrix4fv(shaderProgram.v2wMatrixUniform, false, v2wMatrix);  

    mat4.identity(nMatrix); 
    nMatrix = mat4.multiply(nMatrix, vMatrix);
    nMatrix = mat4.multiply(nMatrix, mMatrix);  
    nMatrix = mat4.inverse(nMatrix);
    nMatrix = mat4.transpose(nMatrix); 


    gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, nMatrix);  


    // gl.uniform4f(shaderProgram.light_posUniform,light_pos[0], light_pos[1], light_pos[2], light_pos[3]);  
    gl.uniform4f(shaderProgram.light_posUniform,light_x, light_y, light_z, light_pos[3]);  
    gl.uniform4f(shaderProgram.ambient_coefUniform, mat_ambient[0], mat_ambient[1], mat_ambient[2], 1.0); 
    gl.uniform4f(shaderProgram.diffuse_coefUniform, mat_diffuse[0], mat_diffuse[1], mat_diffuse[2], 1.0); 
    gl.uniform4f(shaderProgram.specular_coefUniform, mat_specular[0], mat_specular[1], mat_specular[2],1.0); 
    gl.uniform1f(shaderProgram.shininess_coefUniform, mat_shine[0]); 

    gl.uniform4f(shaderProgram.light_ambientUniform, light_ambient[0], light_ambient[1], light_ambient[2], 1.0); 
    gl.uniform4f(shaderProgram.light_diffuseUniform, light_diffuse[0], light_diffuse[1], light_diffuse[2], 1.0); 
    gl.uniform4f(shaderProgram.light_specularUniform, light_specular[0], light_specular[1], light_specular[2],1.0); 


}

 function degToRad(degrees) {
    return degrees * Math.PI / 180;
 }


 var currentlyPressedKeys = {};
// var xPosition = 1;
var moveRotation = 1;
var moveDirection = 1;
var rTri = 0;
var rSquare = 0;
var xSpeed = 0;
var ySpeed = 0;
var zSpeed = 0;
// var xPosition = 0;
// var yPosition = 0;
var movePosition = 0.0;
var moveDegree = 0.0;
var moveMatrix = mat4.create();
mat4.identity(moveMatrix);
var cannonLR = 0.0;
var cannonUD = 0.0;
var starX = 0;
var starY = 0;

var xAutoSpeed = -3;
var yAutoSpeed = 0;
var bumbPosition = 10;

var windowY = 0;

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

function handleKeys() {
    if (currentlyPressedKeys[37]) {
        // Left cursor key
        mat4.rotate(moveMatrix, degToRad(1), [0, 1, 0]);
    }
    if (currentlyPressedKeys[39]) {
        // Right cursor key
        mat4.rotate(moveMatrix, degToRad(-1), [0, 1, 0]);
    }
    if (currentlyPressedKeys[38]) {
        // Up cursor key
        // movePosition += 0.1;
        mat4.translate(moveMatrix, [0.1, 0, 0]);
    }
    if (currentlyPressedKeys[40]) {
        // Down cursor key
        // movePosition -= 0.1;
        mat4.translate(moveMatrix, [-0.1, 0, 0]);
    }
    if (currentlyPressedKeys[87]) {
        // w
        light_y += 0.1;
    }
    if (currentlyPressedKeys[83]) {
        // s
        light_y -= 0.1;
    }
    if (currentlyPressedKeys[65]) {
        // a
        light_x -= 0.1;
    }
    if (currentlyPressedKeys[68]) {
        // d
        light_x += 0.1;
    }

    if (currentlyPressedKeys[81]) {
        // q
        light_z -= 0.1;
    }
    if (currentlyPressedKeys[69]) {
        // e
        light_z += 0.1;
    }


    if (currentlyPressedKeys[32]) {
        if (bumbPosition > 3) {
            bumbPosition = 0;
        }
    }

    if (currentlyPressedKeys[85]) {
        // u
        if (mat_shine[0] > 1) {
            mat_shine[0] -= 1;
        }
    }

    if (currentlyPressedKeys[74]) {
        // j
        mat_shine[0] += 1;
    }
}

var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

var sceneChangeMatrix = mat4.create();
mat4.identity(sceneChangeMatrix);

function handleMouseDown(event) {
  
    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}


function handleMouseUp(event) {

    mouseDown = false;
}


function handleMouseMove(event) {

    if (!mouseDown) {
        return;
    }
    var newX = event.clientX;
    var newY = event.clientY;

    var deltaX = newX - lastMouseX
    var deltaY = newY - lastMouseY;
    var newChangeMatrix = mat4.create();
    // console.log(event.button);
    if (event.button == 0) {
        mat4.identity(newChangeMatrix);
        mat4.rotate(newChangeMatrix, degToRad(deltaX / 5), [0, -1, 0]);
        mat4.rotate(newChangeMatrix, degToRad(deltaY / 5), [-1, 0, 0]);
        mat4.multiply(newChangeMatrix, sceneChangeMatrix, sceneChangeMatrix);
    }
    else if (event.button == 2) {
        mat4.identity(newChangeMatrix);
        mat4.scale(newChangeMatrix, [deltaX / 100 + 1, deltaX/100 + 1, 1.0]);
        mat4.scale(newChangeMatrix, [deltaY/100 + 1, deltaY/100 + 1, 1.0]);
        mat4.multiply(newChangeMatrix, sceneChangeMatrix, sceneChangeMatrix);
    }
    else if (event.button == 1) {
        mat4.identity(newChangeMatrix);
        mat4.translate(newChangeMatrix, [deltaX / 100, 0.0, 0.0]);
        mat4.translate(newChangeMatrix, [0.0, -deltaY / 100, 0.0]);
        mat4.multiply(newChangeMatrix, sceneChangeMatrix, sceneChangeMatrix);
    }

    lastMouseX = newX;
    lastMouseY = newY;
}





///////////////////////////////////////////////////////////////

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    pMatrix = mat4.perspective(90, 1.0, 0.1, 1000, pMatrix);  // set up the projection matrix 
    mat4.lookAt(camPos, camTar, camUp, vMatrix);    // set up the view matrix, multiply into the modelview matrix

    mat4.identity(mMatrix); 


    mat4.translate(mMatrix, [0.0, 0.0, -2.0]);
    // mMatrix = mat4.rotate(mMatrix, degToRad(90), [1, 0, 0]); 
    // mMatrix = mat4.rotate(mMatrix, degToRad(-Z_angle), [0, 0, 1]);   // now set up the model matrix
    mat4.translate(mMatrix, [0.0, 0.0, -5.0]);
    mat4.multiply(vMatrix, sceneChangeMatrix);
    


    // up
    mvPushMatrix();
    mat4.translate(mMatrix, [0, 200, 0]);
    // mat4.rotate(mMatrix, degToRad(180), [0, 0, 1]);
    // mat4.rotate(mMatrix, degToRad(90), [0, 1, 0]);
    mat4.scale(mMatrix, [400, 1, 400]);
    drawEnvironmentElement(cube_faces[0]);
    // drawElement(cube_faces[0]);
    // drawElement(ground);
    mvPopMatrix();


    // test
    mvPushMatrix();
    // mat4.translate(mMatrix, [0, -100, 0]);
    // mat4.rotate(mMatrix, degToRad(180), [1, 0, 1]);
    // mat4.scale(mMatrix, [4, 4, 4]);
    // setEnvironmentTexture(cube_faces[0]);
    // gl.uniform1i(shaderProgram.shouldDrawObject, true);
    // drawObject(cube);
    // drawElement(sylinder);
    // drawObject(ground);
    drawObject(sphere);
    mvPopMatrix();

    // down
    mvPushMatrix();
    mat4.translate(mMatrix, [0, -200, 0]);
    mat4.rotate(mMatrix, degToRad(-180), [1, 0, 0]);
    mat4.rotate(mMatrix, degToRad(-90), [0, 1, 0]);
    mat4.scale(mMatrix, [400, 1, 400]);
    drawEnvironmentElement(cube_faces[1]);
    mvPopMatrix();
    
    // left
    mvPushMatrix();
    mat4.translate(mMatrix, [-200, 0, 0]);
    mat4.rotate(mMatrix, degToRad(90), [0, 0, 1]);
    mat4.rotate(mMatrix, degToRad(-90), [0, 1, 0]);
    // mat4.rotate(mMatrix, degToRad(90), [1, 0, 0]);
    mat4.scale(mMatrix, [400, 1, 400]);
    drawEnvironmentElement(cube_faces[2]);
    mvPopMatrix();

    // right
    mvPushMatrix();
    mat4.translate(mMatrix, [200, 0, 0]);
    mat4.rotate(mMatrix, degToRad(-90), [0, 0, 1]);
    mat4.rotate(mMatrix, degToRad(90), [0, 1, 0]);
    // mat4.rotate(mMatrix, degToRad(90), [1, 0, 0]);
    mat4.scale(mMatrix, [400, 1, 400]);
    drawEnvironmentElement(cube_faces[3]);
    mvPopMatrix();

    // front
    mvPushMatrix();
    mat4.translate(mMatrix, [0, 0, -200]);
    mat4.rotate(mMatrix, degToRad(-90), [1, 0, 0]);
    mat4.rotate(mMatrix, degToRad(180), [0, 1, 0]);
    mat4.scale(mMatrix, [400, 1, 400]);
    drawEnvironmentElement(cube_faces[4]);
    mvPopMatrix();

    // back
    mvPushMatrix();
    mat4.translate(mMatrix, [0, 0, 200]);
    mat4.rotate(mMatrix, degToRad(90), [1, 0, 0]);
    // mat4.rotate(mMatrix, degToRad(180), [0, 0, 1]);
    mat4.scale(mMatrix, [400, 1, 400]);
    drawEnvironmentElement(cube_faces[5]);
    mvPopMatrix();

    mat4.multiply(mMatrix, moveMatrix);

    // tank body
    mvPushMatrix();
    // mat4.rotate(mMatrix, degToRad(rsylinder), [1, 0, 0]);
    // mat4.scale(mMatrix, [500, 100, 300]);
    // drawObject(cube);
    mvPopMatrix();

    // base
    mvPushMatrix();
    mat4.rotate(mMatrix, degToRad(cannonLR), [0, 1, 0]);
    mat4.translate(mMatrix, [0.0, 2.5/2, 0.0]);        
    // mat4.rotate(mMatrix, degToRad(30), [0, 1, 0]);
    // drawObject(sylinder);
    mvPushMatrix();
    mat4.rotate(mMatrix, degToRad(cannonUD), [0, 0, 1]);
    mat4.rotate(mMatrix, degToRad(-80), [0, 0, 1]);
    mat4.translate(mMatrix, [0.2, 2, 0]);
    // mat4.rotate(mMatrix, degToRad(30), [0, -1, 0]);
    // mat4.translate(mMatrix, [0, 0.5, 0]);
    // mat4.rotate(mMatrix, degToRad(90 - 20), [0, 0, -1]);
    // mat4.translate(mMatrix, [0, -0.5, 0]);
    mat4.scale(mMatrix, [1, 3, 1]);
    // drawObject(cannon);
    mat4.rotate(mMatrix, degToRad(90), [0, 0, 1]);
    mvPushMatrix();
    mat4.scale(mMatrix, [1/3, 1, 1]);
    // mat4.translate(mMatrix, [bumbPosition, 0, 0]);
    mat4.rotate(mMatrix, degToRad(rPyramid), [0, 1, 0]);
    // drawObject(sphere);
    mvPopMatrix();
    mvPopMatrix();
    mvPopMatrix();

   

   setMatrixUniforms();   // pass the modelview mattrix and projection matrix to the shader 

}

function webGLStart() {
    var canvas = document.getElementById("code03-canvas");
    // canvas.width = screen.width;
    // canvas.height = screen.height;
    initGL(canvas);
    initShaders();

    gl.enable(gl.DEPTH_TEST); 
    initTexture();
    initCubeMap();
    initBuffers();
    

    gl.clearColor(0.2, 0.2, 0.2, 1.0);

   // document.addEventListener('mousedown', onDocumentMouseDown,false); 

    // drawScene();
    canvas.oncontextmenu = function (e) {e.preventDefault();};
    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    // drawScene();
    tick();
}
var lastTime = 0;

function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;
        bumbPosition += 1/10;
        rPyramid += (90 * elapsed) / 1000.0;
        rsylinder -= (75 * elapsed) / 1000.0;
    }
    lastTime = timeNow;
}
function tick() {
    requestAnimFrame(tick);
    drawScene();
    animate();
    handleKeys();
}
