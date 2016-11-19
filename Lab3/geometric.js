function Plane(size, color) {
    var vertices = [];
    var colors = [];
    var indices = [];
    this.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    this.vertices = [
        -size/2,  size/2, -size/2,
        -size/2,  size/2,  size/2,
         size/2,  size/2,  size/2,
         size/2,  size/2, -size/2,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    this.vertexPositionBuffer.itemSize = 3;
    this.vertexPositionBuffer.numItems = this.vertices.length/3;

    this.vertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
    this.normalData = [
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normalData), gl.STATIC_DRAW);
    this.vertexNormalBuffer.itemSize = 3;
    this.vertexNormalBuffer.numItems = this.normalData.length / 3;

    this.vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
    this.colors = [
        1.0, 0.0, 0.0, 1.0,
        1.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        1.0, 0.5, 0.5, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
    this.vertexColorBuffer.itemSize = 4;
    this.vertexColorBuffer.numItems = this.colors.length/4;

    this.vertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
    this.vertexIndices = [
        0, 1, 2,      0, 2, 3,
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.vertexIndices), gl.STATIC_DRAW);
    this.vertexIndexBuffer.itemSize = 1;
    this.vertexIndexBuffer.numItems = this.vertexIndices.length;
}

function Cube(size, color) {
    var vertices = [];
    var colors = [];
    var indices = [];
    this.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    vertices = [
        // Front face
        -size/2, -size/2,  size/2,
         size/2, -size/2,  size/2,
         size/2,  size/2,  size/2,
        -size/2,  size/2,  size/2,

        // Back face
        -size/2, -size/2, -size/2,
        -size/2,  size/2, -size/2,
         size/2,  size/2, -size/2,
         size/2, -size/2, -size/2,

        // Top face
        -size/2,  size/2, -size/2,
        -size/2,  size/2,  size/2,
         size/2,  size/2,  size/2,
         size/2,  size/2, -size/2,

        // Bottom face
        -size/2, -size/2, -size/2,
         size/2, -size/2, -size/2,
         size/2, -size/2,  size/2,
        -size/2, -size/2,  size/2,

        // Right face
         size/2, -size/2, -size/2,
         size/2,  size/2, -size/2,
         size/2,  size/2,  size/2,
         size/2, -size/2,  size/2,

        // Left face
        -size/2, -size/2, -size/2,
        -size/2, -size/2,  size/2,
        -size/2,  size/2,  size/2,
        -size/2,  size/2, -size/2
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.vertexPositionBuffer.itemSize = 3;
    this.vertexPositionBuffer.numItems = 24;

    this.vertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
    this.normalData = [
        // Front face
         0.0,  0.0,  1.0,
         0.0,  0.0,  1.0,
         0.0,  0.0,  1.0,
         0.0,  0.0,  1.0,

        // Back face
         0.0,  0.0, -1.0,
         0.0,  0.0, -1.0,
         0.0,  0.0, -1.0,
         0.0,  0.0, -1.0,

        // Top face
         0.0,  1.0,  0.0,
         0.0,  1.0,  0.0,
         0.0,  1.0,  0.0,
         0.0,  1.0,  0.0,

        // Bottom face
         0.0, -1.0,  0.0,
         0.0, -1.0,  0.0,
         0.0, -1.0,  0.0,
         0.0, -1.0,  0.0,

        // Right face
         1.0,  0.0,  0.0,
         1.0,  0.0,  0.0,
         1.0,  0.0,  0.0,
         1.0,  0.0,  0.0,

        // Left face
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normalData), gl.STATIC_DRAW);
    this.vertexNormalBuffer.itemSize = 3;
    this.vertexNormalBuffer.numItems = this.normalData.length / 3;

    this.vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
    colors = [
        [1.0, 0.0, 0.0, 1.0], // Front face
        [1.0, 1.0, 0.0, 1.0], // Back face
        [0.0, 1.0, 0.0, 1.0], // Top face
        [1.0, 0.5, 0.5, 1.0], // Bottom face
        [1.0, 0.0, 1.0, 1.0], // Right face
        [0.0, 0.0, 1.0, 1.0]  // Left face
    ];
    var unpackedColors = [];
    for (var i in colors) {
        var color = colors[i];
        for (var j=0; j < 4; j++) {
            unpackedColors = unpackedColors.concat(color);
        }
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
    this.vertexColorBuffer.itemSize = 4;
    this.vertexColorBuffer.numItems = 24;

    this.vertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
    this.vertexIndices = [
        0, 1, 2,      0, 2, 3,    // Front face
        4, 5, 6,      4, 6, 7,    // Back face
        8, 9, 10,     8, 10, 11,  // Top face
        12, 13, 14,   12, 14, 15, // Bottom face
        16, 17, 18,   16, 18, 19, // Right face
        20, 21, 22,   20, 22, 23  // Left face
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.vertexIndices), gl.STATIC_DRAW);
    this.vertexIndexBuffer.itemSize = 1;
    this.vertexIndexBuffer.numItems = 36;
}

function Sphere(radius, numSlices, numStacks, color) {
    var vertices = [];
    var colors = [];
    var indices = [];
    var normalData = [];
    var divideNum = 6;
    for (var i = 0; i < numStacks + 1; i++) {
        for (var j = 0; j < numSlices; j++) {
            var fi = degToRad(180 / numStacks * i - 90);
            var thita = degToRad(360 / numSlices * j);
            var r = radius;
            var x = Math.cos(thita) * Math.cos(fi);
            var y = Math.sin(fi);
            var z = Math.sin(thita) * Math.cos(fi);
            vertices = vertices.concat([x * r, y * r, z * r]);
            normalData = normalData.concat([x, y, z]);
            colors = colors.concat([1.0*Math.abs(x), 1*Math.abs(y), 1*Math.abs(z), 1.0]);
            // colors = colors.concat(color);
        }
    }
    
    for (var i = 0; i < numStacks; i++) {
        for (var j = 0; j < numSlices; j++) {
            a = i*numSlices + j;
            b = i*numSlices + (j + 1) % numSlices;
            c = (i+1)*numSlices + j;
            d = (i+1)*numSlices + (j + 1) % numSlices;
            indices = indices.concat([a, b, c, b, c, d]);
        }
    }
    this.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.vertexPositionBuffer.itemSize = 3;
    this.vertexPositionBuffer.numItems = vertices.length / 3;

    this.vertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
    this.normalData = normalData;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normalData), gl.STATIC_DRAW);
    this.vertexNormalBuffer.itemSize = 3;
    this.vertexNormalBuffer.numItems = this.normalData.length / 3;

    this.vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    this.vertexColorBuffer.itemSize = 4;
    this.vertexColorBuffer.numItems = colors.length / 4;

    this.vertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    this.vertexIndexBuffer.itemSize = 1;
    this.vertexIndexBuffer.numItems = indices.length;
}
var debug;
function Sylinder(baseRadius, topRadius, height, numSlices, numStacks, color) {
    var vertices = [];
    var colors = [];
    var indices = [];
    var normalData = [];
    
    // side
    for (var i = 0; i < numStacks + 1; i++) {
        for (var j = 0; j < numSlices; j++) {
            var r = ((baseRadius - topRadius) / numStacks * i + topRadius);
            var thita = degToRad(360 / numSlices * j);
            var x = r * Math.cos(thita);
            var y = height / numStacks * i - height/2;
            var z = r * Math.sin(thita);
            vertices = vertices.concat([x, y, z]);
            var nx = Math.cos(thita) * height / Math.sqrt(height * height + (baseRadius - topRadius) * (baseRadius - topRadius));
            var ny = (baseRadius - topRadius) / Math.sqrt(height * height + (baseRadius - topRadius) * (baseRadius - topRadius));
            var nz = Math.sin(thita) * height / Math.sqrt(height * height + (baseRadius - topRadius) * (baseRadius - topRadius));
            normalData = normalData.concat([nx, ny, nz]);
            colors = colors.concat([1.0*Math.abs(x), 1*Math.abs(y), 1*Math.abs(z), 1.0]);
        }
    }
    for (var i = 0; i < numStacks; i++) {
        for (var j = 0; j < numSlices; j++) {
            var a = i*numSlices + j;
            var b = i*numSlices + (j + 1) % numSlices;
            var c = (i+1)*numSlices + j;
            var d = (i+1)*numSlices + (j + 1) % numSlices;
            indices = indices.concat([a, b, c, b, c, d]);
        }
    }

    // up    
    // vertices, color, normal
    for (var i = 0; i < numSlices; i++) {
        var r = baseRadius;
        var thita = degToRad(360 / numSlices * i);
        var x = r * Math.cos(thita);
        var y = height/2;
        var z = r * Math.sin(thita);
        vertices = vertices.concat([x, y, z]);
        normalData = normalData.concat([0, 1, 0]);
        colors = colors.concat([1.0*Math.abs(x), 1*Math.abs(y), 1*Math.abs(z), 1.0]);
    }
    vertices = vertices.concat([0, height/2, 0]); 
    colors = colors.concat([1.0*Math.abs(0), 1*Math.abs(0), 1*Math.abs(-1), 1.0]);
    normalData = normalData.concat([0, 1, 0]);
    // indices
    for (var i = 0; i < numSlices; i++) {
        var a = vertices.length / 3 - 1;
        var b = vertices.length / 3 - 1 - numSlices + i;
        var c = vertices.length / 3 - 1 - numSlices + (i + 1) % numSlices;
        indices = indices.concat([a, b, c]);
    }
    debug_indices = indices;
    debug_vertices = vertices;
    // down
    // vertices
    for (var i = 0; i < numSlices; i++) {
        var r = topRadius;
        var thita = degToRad(360 / numSlices * i);
        var x = r * Math.cos(thita);
        var y = -height/2;
        var z = r * Math.sin(thita);
        vertices = vertices.concat([x, y, z]);
        normalData = normalData.concat([0, -1, 0]);
        colors = colors.concat([1.0*Math.abs(x), 1*Math.abs(y), 1*Math.abs(z), 1.0]);
    }
    vertices = vertices.concat([0, -height/2, 0]);
    colors = colors.concat([1.0*Math.abs(0), 1*Math.abs(0), 1*Math.abs(1), 1.0]);
    normalData = normalData.concat([0, -1, 0]);
    // indices
    for (var i = 0; i < numSlices; i++) {
        var a = vertices.length / 3 - 1;
        var b = vertices.length / 3 - 1 - numSlices + i;
        var c = vertices.length / 3 - 1 - numSlices + (i + 1) % numSlices;
        indices = indices.concat([a, b, c]);
    }

    this.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.vertexPositionBuffer.itemSize = 3;
    this.vertexPositionBuffer.numItems = vertices.length / 3;

    this.vertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
    this.normalData = normalData;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normalData), gl.STATIC_DRAW);
    this.vertexNormalBuffer.itemSize = 3;
    this.vertexNormalBuffer.numItems = this.normalData.length / 3;

    this.vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    this.vertexColorBuffer.itemSize = 4;
    this.vertexColorBuffer.numItems = colors.length / 4;

    this.vertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    this.vertexIndexBuffer.itemSize = 1;
    this.vertexIndexBuffer.numItems = indices.length;
}
