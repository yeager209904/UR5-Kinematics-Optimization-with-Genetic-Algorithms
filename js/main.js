import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Initial aspect ratio is set to 1, will update later

const slider_J1 = document.getElementById('theta1Slider');
const slider_J2 = document.getElementById('theta2Slider');
const slider_J3_Cube = document.getElementById('theta3Slider');
const slider_J4 = document.getElementById('theta4Slider');
const slider_J5 = document.getElementById('theta5Slider');
const slider_J6 = document.getElementById('theta6Slider');
const transformationMatrixElement = document.getElementById('transformationMatrix');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let a = 0, b = 0, c = 0, d = 0, e = 0, f = 0;
let object;
let controls;

const loader = new GLTFLoader();
loader.load('models/Ur 5/ur5_mashallah.gltf', function(gltf) {
    object = gltf.scene;
    object.scale.setScalar(13);
    object.position.y = -3;
    object.position.x = -1;
    scene.add(object);

    let main_Circle_base = gltf.scene.getObjectByName("object1");
    slider_J1.addEventListener("input", function (event) {
        let value = event.target.value;
        main_Circle_base.rotation.x = value * Math.PI / 360;
        a = main_Circle_base.rotation.x;
        document.getElementById('d1').innerText = value;
        updateTransformationMatrix(a, b, c, d, e, f);
    });

    let Joint2_Box = gltf.scene.getObjectByName("object2");
    slider_J2.addEventListener("input", function (event) {
        let value = event.target.value;
        Joint2_Box.rotation.x = value * Math.PI / 180;
        b = Joint2_Box.rotation.x;
        document.getElementById('d2').innerText = value;
        updateTransformationMatrix(a, b, c, d, e, f);
    });

    let J3_Cube = gltf.scene.getObjectByName("object3");
    slider_J3_Cube.addEventListener("input", function (event) {
        let value = event.target.value;
        J3_Cube.rotation.y = value * Math.PI / 450;
        c = J3_Cube.rotation.y;
        document.getElementById('d3').innerText = value;
        updateTransformationMatrix(a, b, c, d, e, f);
    });

    let J4_Circle = gltf.scene.getObjectByName("object4");
    slider_J4.addEventListener("input", function (event) {
        let value = event.target.value;
        J4_Circle.rotation.y = value * Math.PI / 180;
        d = J4_Circle.rotation.y;
        document.getElementById('d4').innerText = value;
        updateTransformationMatrix(a, b, c, d, e, f);
    });

    let J5_Circle = gltf.scene.getObjectByName("object5");
    slider_J5.addEventListener("input", function (event) {
        let value = event.target.value;
        J5_Circle.rotation.x = value * Math.PI / 180;
        e = J5_Circle.rotation.x;
        document.getElementById('d5').innerText = value;
        updateTransformationMatrix(a, b, c, d, e, f);
    });

    let J6_Circle = gltf.scene.getObjectByName("object6");
    slider_J6.addEventListener("input", function (event) {
        let value = event.target.value;
        J6_Circle.rotation.y = value * Math.PI / 180;
        f = J6_Circle.rotation.y;
        document.getElementById('d6').innerText = value;
        updateTransformationMatrix(a, b, c, d, e, f);
    });

}, function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
}, function (error) {
    console.error(error);
});

const renderer = new THREE.WebGLRenderer({ alpha: true });
const container = document.getElementById("container3D");
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

camera.aspect = container.clientWidth / container.clientHeight;
camera.updateProjectionMatrix();

camera.position.z = 15;

// Lighting setup
const topLight = new THREE.DirectionalLight(0xffffff, 0.5);
topLight.position.set(500, 500, 500);
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 1);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0xffffff, 0.5, 0);
pointLight1.position.set(50, 50, 50);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, 0.3, 0);
pointLight2.position.set(-50, -50, -50);
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0xffffff, 0.3, 0);
pointLight3.position.set(0, 50, -50);
scene.add(pointLight3);

controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false; // Disable rotation
controls.enablePan = false; // Disable panning
controls.enableZoom = false; // Disable zooming

function animate() {
    requestAnimationFrame(animate);

    if (object) {
        object.rotation.y = -3 + mouseX / window.innerWidth * 3;
        object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
    }
    renderer.render(scene, camera);
}

window.addEventListener("resize", function () {
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
});

animate();

function updateTransformationMatrix(a, b, c, d, e, f) {
    const theta1 = a;
    const theta2 = b;
    const theta3 = c;
    const theta4 = d;
    const theta5 = e;
    const theta6 = f;

    const DH = [
        [0, Math.PI / 2, 0.08196, theta1],
        [0.425, 0, 0, theta2],
        [0.39225, 0, 0, theta3],
        [0, Math.PI / 2, 0.10915, theta4],
        [0, -Math.PI / 2, 0.09456, theta5],
        [0, 0, 0.0823, theta6]
    ];

    const matrices = DH.map(params => {
        const [a, alpha, d, theta] = params;
        const cTheta = Math.cos(theta);
        const sTheta = Math.sin(theta);
        const cAlpha = Math.cos(alpha);
        const sAlpha = Math.sin(alpha);
    
        return [
            [cTheta, -sTheta * cAlpha, sTheta * sAlpha, a * cTheta],
            [sTheta, cTheta * cAlpha, -cTheta * sAlpha, a * sTheta],
            [0, sAlpha, cAlpha, d],
            [0, 0, 0, 1]
        ];
    });

    let T = matrices[0];
    for (let i = 1; i < matrices.length; i++) {
        T = multiplyMatrices(T, matrices[i]);
    }

    transformationMatrixElement.innerHTML = matrixToHtml(T);
    // Update end-effector position
    const endEffectorPos = forwardKinematics([theta1, theta2, theta3, theta4, theta5, theta6]);
    document.getElementById('endEffectorPosition').innerText = `End Effector Position: x = ${endEffectorPos[0].toFixed(4)}, y = ${endEffectorPos[1].toFixed(4)}, z = ${endEffectorPos[2].toFixed(4)}`;
}

function multiplyMatrices(A, B) {
    const result = [];
    for (let i = 0; i < 4; i++) {
        result[i] = [];
        for (let j = 0; j < 4; j++) {
            result[i][j] = 0;
            for (let k = 0; k < 4; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return result;
}

function matrixToHtml(matrix) {
    return matrix.map(row => '<tr>' + row.map(val => `<td>${val.toFixed(4)}</td>`).join('') + '</tr>').join('');
}

updateTransformationMatrix();

// Forward Kinematics: Calculate end-effector position
function forwardKinematics(jointAngles) {
    const [theta1, theta2, theta3, theta4, theta5, theta6] = jointAngles;

    const DH = [
        [0, Math.PI / 2, 0.08196, theta1],
        [0.425, 0, 0, theta2],
        [0.39225, 0, 0, theta3],
        [0, Math.PI / 2, 0.10915, theta4],
        [0, -Math.PI / 2, 0.09456, theta5],
        [0, 0, 0.0823, theta6]
    ];

    const matrices = DH.map(params => {
        const [a, alpha, d, theta] = params;
        const cTheta = Math.cos(theta);
        const sTheta = Math.sin(theta);
        const cAlpha = Math.cos(alpha);
        const sAlpha = Math.sin(alpha);
    
        return [
            [cTheta, -sTheta * cAlpha, sTheta * sAlpha, a * cTheta],
            [sTheta, cTheta * cAlpha, -cTheta * sAlpha, a * sTheta],
            [0, sAlpha, cAlpha, d],
            [0, 0, 0, 1]
        ];
    });

    let T = matrices[0];
    for (let i = 1; i < matrices.length; i++) {
        T = multiplyMatrices(T, matrices[i]);
    }

    // End-effector position
    const endEffectorPosition = [T[0][3], T[1][3], T[2][3]];
    return endEffectorPosition;
}

// Inverse Kinematics using Genetic Algorithm

// Genetic Algorithm for Inverse Kinematics with fixed seed
function inverseKinematics(desiredPosition) {
    const randomSeed = 12345; // Fixed seed for reproducibility
    Math.seedrandom(randomSeed);

    const populationSize = 200;
    const mutationRate = 0.005;
    const crossoverRate = 0.8;
    const maxGenerations = 200;
    const eliteCount = 5;

    function createInitialPopulation() {
        const population = [];
        for (let i = 0; i < populationSize; i++) {
            const individual = [
                Math.random() * 360,
                Math.random() * 360,
                Math.random() * 360,
                Math.random() * 360,
                Math.random() * 360,
                Math.random() * 360
            ];
            population.push(individual);
        }
        return population;
    }

    function calculateFitness(individual) {
        const endEffectorPosition = forwardKinematics(individual);
        const distance = Math.sqrt(
            Math.pow(endEffectorPosition[0] - desiredPosition[0], 2) +
            Math.pow(endEffectorPosition[1] - desiredPosition[1], 2) +
            Math.pow(endEffectorPosition[2] - desiredPosition[2], 2)
        );
        return 1 / (distance + 0.001);
    }

    function selection(population, fitnessScores) {
        const totalFitness = fitnessScores.reduce((sum, { fitness }) => sum + fitness, 0);
        const probabilities = fitnessScores.map(({ fitness }) => fitness / totalFitness);
        const selected = [];
        for (let i = 0; i < populationSize; i++) {
            let rand = Math.random();
            let sum = 0;
            for (let j = 0; j < populationSize; j++) {
                sum += probabilities[j];
                if (rand < sum) {
                    selected.push(population[j]);
                    break;
                }
            }
        }
        return selected;
    }

    function crossover(parents) {
        const offspring = [];
        for (let i = 0; i < populationSize; i += 2) {
            const parent1 = parents[i];
            const parent2 = parents[i + 1];
            const crossoverPoint = Math.floor(Math.random() * parent1.length);
            const child1 = [...parent1.slice(0, crossoverPoint), ...parent2.slice(crossoverPoint)];
            const child2 = [...parent2.slice(0, crossoverPoint), ...parent1.slice(crossoverPoint)];
            offspring.push(child1, child2);
        }
        return offspring;
    }

    function mutate(offspring) {
        for (let i = 0; i < populationSize; i++) {
            for (let j = 0; j < offspring[i].length; j++) {
                if (Math.random() < mutationRate) {
                    offspring[i][j] += (Math.random() - 0.5) * 10;
                }
            }
        }
    }

    function survivalSelection(population, offspring, fitnessScores) {
        const combinedPopulation = population.concat(offspring);
        const combinedFitnessScores = combinedPopulation.map(individual => ({
            individual,
            fitness: calculateFitness(individual)
        }));

        combinedFitnessScores.sort((a, b) => b.fitness - a.fitness);

        const eliteIndividuals = combinedFitnessScores.slice(0, eliteCount).map(({ individual }) => individual);

        const remainingPopulation = combinedFitnessScores.slice(eliteCount);
        const selected = selection(remainingPopulation.map(({ individual }) => individual), remainingPopulation);

        return eliteIndividuals.concat(selected.slice(0, populationSize - eliteCount));
    }

    let population = createInitialPopulation();
    let generation = 0;
    let bestFitness = -Infinity;
    let bestIndividual = null;

    while (generation < maxGenerations) {
        const fitnessScores = population.map(individual => ({
            individual,
            fitness: calculateFitness(individual)
        }));

        fitnessScores.forEach(({ fitness, individual }) => {
            if (fitness > bestFitness) {
                bestFitness = fitness;
                bestIndividual = individual.slice();
            }
        });

        if (bestFitness > 1000) {
            console.log("Solution found!");
            return bestIndividual;
        }

        const parents = selection(population, fitnessScores);
        let offspring = crossover(parents);
        mutate(offspring);
        population = survivalSelection(population, offspring, fitnessScores);

        generation++;
    }

    console.log("No solution found within the maximum generations.");
    return bestIndividual;
}

// Get references to the input field and button
const endEffectorInput = document.getElementById('endEffectorInput');
const calculateIKButton = document.getElementById('calculateIKButton');

// Add event listener to the button
calculateIKButton.addEventListener('click', () => {
  const inputValue = endEffectorInput.value;
  const desiredPosition = inputValue
    .split(',')
    .map(coord => parseFloat(coord.trim()))
    .filter(num => !isNaN(num));

  if (desiredPosition.length !== 3) {
    alert('Invalid input format. Please enter x,y,z coordinates.');
    return;
  }

  const solution = inverseKinematics(desiredPosition);
  if (solution) {
    console.log("Inverse kinematics solution:", solution);
    updateJointAngles(solution);
    update3DModel(solution);
  } else {
    console.log("Failed to find inverse kinematics solution.");
  }
});

const solution = inverseKinematics(desiredPosition);
if (solution) {
    console.log("Inverse kinematics solution:", solution);
    updateJointAngles(solution);
    update3DModel(solution);
} else {
    console.log("Failed to find inverse kinematics solution.");
}

// Adding Math.seedrandom function to set the seed
Math.seedrandom = function(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

// Update joint angles in HTML
function updateJointAngles(jointAngles) {
    document.getElementById('angle1').innerText = jointAngles[0] + "°";
    document.getElementById('angle2').innerText = jointAngles[1] + "°";
    document.getElementById('angle3').innerText = jointAngles[2] + "°";
    document.getElementById('angle4').innerText = jointAngles[3] + "°";
    document.getElementById('angle5').innerText = jointAngles[4] + "°";
    document.getElementById('angle6').innerText = jointAngles[5] + "°";

    

    // Update the transformation matrix with the new joint angles
    updateTransformationMatrix(...jointAngles);
}

function update3DModel(solution) {
    const [theta1, theta2, theta3, theta4, theta5, theta6] = solution;
    const main_Circle_base = object.getObjectByName("object1");
    console.log(main_Circle_base);
    const Joint2_Box = object.getObjectByName("object2");
    const J3_Cube = object.getObjectByName("object3");
    const J4_Circle = object.getObjectByName("object4");
    const J5_Circle = object.getObjectByName("object5");
    const J6_Circle = object.getObjectByName("object6");

    main_Circle_base.rotation.x = theta1 * Math.PI / 180;
    Joint2_Box.rotation.x = theta2 * Math.PI / 180;
    J3_Cube.rotation.y = theta3 * Math.PI / 180;
    J4_Circle.rotation.y = theta4 * Math.PI / 180;
    J5_Circle.rotation.x = theta5 * Math.PI / 180;
    J6_Circle.rotation.y = theta6 * Math.PI / 180;

    slider_J1.value = theta1;
    slider_J2.value = theta2;
    slider_J3_Cube.value = theta3;
    slider_J4.value = theta4;
    slider_J5.value = theta5;
    slider_J6.value = theta6;

    document.getElementById('d1').innerText = theta1;
    document.getElementById('d2').innerText = theta2;
    document.getElementById('d3').innerText = theta3;
    document.getElementById('d4').innerText = theta4;
    document.getElementById('d5').innerText = theta5;
    document.getElementById('d6').innerText = theta6;
}