const borneVue=12;//amplitude de deplacement de la camera
var g1ok=false;
var galetcourant=1;
var com=0;
var xyz=0;

function init(){
 let stats = initStats();
    // creation de rendu et de la taille
 let rendu = new THREE.WebGLRenderer({ antialias: true });
 rendu.shadowMap.enabled = true;
 let scene = new THREE.Scene();
 let result;
 let camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 100);
 rendu.shadowMap.enabled = true;
 rendu.setClearColor(new THREE.Color(0xFFFFFF));
 rendu.setSize(window.innerWidth*.9, window.innerHeight*.9);
 cameraLumiere(scene,camera);
 lumiere(scene);
 repere(scene);

 //plans contenant deux axes du repere
 //planRepere(scene);
 //plan du sol
  const largPlan = 60;
  const hautPlan = 20;
  const nbSegmentLarg = 30;
  const nbSegmentHaut = 30;
  const PlanSolGeometry = new THREE.PlaneGeometry(largPlan,hautPlan,nbSegmentLarg,nbSegmentHaut);
  const PlanSol = surfPhong(PlanSolGeometry,"#D3D3D3",1,true,"#FFFFFF");
  PlanSol.position.z = 0;
  PlanSol.receiveShadow = true;
  PlanSol.castShadow = true;
  scene.add(PlanSol);
// fin du plan du sol

let MaterialPhong = new THREE.MeshPhongMaterial({
  color: "#999900",
  opacity: 1,
  transparent: true,
  wireframe: false,
  emissive:0x000000,
  specular:"#00FFFF",
  flatShading: true,
  shininess:30,//brillance
  side: THREE.DoubleSide,//2
//  side: THREE.FrontSide,//0
  //side: THREE.BackSide,//1
});

  maison(scene);
  ligne(scene);
  g1=galet("#880000");
  g1.position.set(25.5, 3.3, 0.75);
  scene.add(g1);
  g2=galet("#880000");
  g2.position.set(25.5, 6.6, 0.75);
  scene.add(g2);
  g3=galet("#880000");
  g3.position.set(28, 2, 0.75);
  scene.add(g3);
  g4=galet("#880000");
  g4.position.set(28, 5, 0.75);
  scene.add(g4);
  g5=galet("#880000");
  g5.position.set(28, 8, 0.75);
  scene.add(g5);

  g6=galet("#008800");
  g6.position.set(25.5, -3.3, 0.75);
  scene.add(g6);
  g7=galet("#008800");
  g7.position.set(25.5, -6.6, 0.75);
  scene.add(g7);
  g8=galet("#008800");
  g8.position.set(28, -2, 0.75);
  scene.add(g8);
  g9=galet("#008800");
  g9.position.set(28, -5, 0.75);
  scene.add(g9);
  g10=galet("#008800");
  g10.position.set(28, -8, 0.75);
  scene.add(g10);

  ba1=balais();
  ba1.position.set(17, 13, -1.0);
  scene.add(ba1);


  ba2=balais();
  ba2.position.set(17, -13, -1.0);
  ba2.rotateZ(3.14);
  scene.add(ba2);

  linetraj=traceRectiligne(0);
  scene.add(linetraj);

  let P00 = new THREE.Vector3(-25,0,0.75);
  let P11 = new THREE.Vector3(0,-5,0.75);
  let P22 = new THREE.Vector3(20,0,0.75);
  test=TraceBezierQuadratique(P00, P11, P22, 100,"#0000FF",5);
  scene.add(test);

  function latheBez3(nbePtCbe,nbePtRot,P0,P1,P2,P3,coul,opacite,bolTranspa){
   let p0= new THREE.Vector2(P0.x,P0.y);
   let p1= new THREE.Vector2(P1.x,P1.y);
   let p2= new THREE.Vector2(P2.x,P2.y);
   let p3= new THREE.Vector2(P3.x,P3.y);
   let tabp= new Array(4);
   for (let j=0;j<tabp.length;j++)
     tabp[j]= new THREE.Vector2(0,0);
   tabp[0].copy(p0);tabp[1].copy(p1);
   tabp[2].copy(p2);tabp[3].copy(p3);
   // points de la courbe de Bezier
   let points = new Array(nbePtCbe+1);
   for(let k=0;k<=(nbePtCbe+1);k++){
     let t2=k/nbePtCbe;
     t2=t2.toPrecision(PrecisionArrondi);
     let v0= new THREE.Vector2(0,0);
     v0.addScaledVector(tabp[0],Ber(t2,0,tabp.length-1));
     for(let j=1;j<tabp.length;j++){
       let v1= new THREE.Vector2(0,0);
       v1.addScaledVector(tabp[j],Ber(t2,j,tabp.length-1));
       v0.add(v1);
     }
     points[k] = new THREE.Vector2(v0.x,v0.y);
   }
   let latheGeometry = new THREE.LatheGeometry(points,nbePtRot,0,2*Math.PI);
   let lathe = surfPhong(latheGeometry,coul,opacite,bolTranspa,"#223322");
   return lathe;
  }// fin latheBez3

 //********************************************************
 //
 //  D E B U T     M E N U     G U I
 //
 //********************************************************
 var gui = new dat.GUI(); //interface graphique utilisateur
  // ajout du menu dans le GUI
 let menuGUI = new function () {
   this.cameraxPos = camera.position.x;
   this.camerayPos = camera.position.y;
   this.camerazPos = camera.position.z;
   this.cameraZoom = 1;
   this.cameraxDir = 0;
   this.camerayDir = 0;
   this.camerazDir = 0;
   this.ChoixC = true;
   this.yF = 0;
   this.pt1x = 0;
   this.pt1y = 0;
   this.pt2x = 0;
   this.pt2y = 0;

   //pour actualiser dans la scene
   this.actualisation = function () {
    posCamera();
    reAffichage();
   }; // fin this.actualisation

   this.commencer = function () {
    posCamera();
    reAffichage();
    alert("Jeu du Curling - Partie avec 5 lancer pour chaque équipe - Equipe Rouge Veuillez commencez !") ;
    commencer();
   }; // fin this.actualisation

   this.Lancer = function () {
     Lancer();
     posCamera();
     reAffichage();
   }; // fin this.actualisation


 }; // fin de la fonction menuGUI
 // ajout de la camera dans le menu
 ajoutCameraGui(gui,menuGUI,camera)
 // choix du valeur de k


 let guiTraj = gui.addFolder("Trajectoire");

 guiTraj.add(menuGUI,"ChoixC").onChange(function (e) {       // true pour rectiligne et 0 pour une courbe
   if (!e){
     this.ChoixC==false;
     scene.remove(linetraj);
   }
   else {
     this.ChoixC==true;
   }
  });

 guiTraj.add(menuGUI,"yF",-10,10).onChange(function () {
     let yBfinal = Math.floor(menuGUI.yF);
     scene.remove(linetraj);
     linetraj = traceRectiligne(yBfinal);
     //posCamera();
     scene.add(linetraj);
 });

 guiTraj.add(menuGUI,"pt1x",-18,18).onChange(function () {
     let controlpt1x = Math.floor(menuGUI.pt1x);
     scene.remove(test);
     P11.x= controlpt1x;
     test =TraceBezierQuadratique(P00, P11, P22, 100,"#0000FF",5);
     //posCamera();
     scene.add(test);
 });

 guiTraj.add(menuGUI,"pt1y",-18,18).onChange(function () {
     let controlpt1y = Math.floor(menuGUI.pt1y);
     scene.remove(test);
     P11.y= controlpt1y;
     test =TraceBezierQuadratique(P00, P11, P22, 100,"#0000FF",5);
     //posCamera();
     scene.add(test);
 });
 guiTraj.add(menuGUI,"pt2x",-18,18).onChange(function () {
     let controlpt2x = Math.floor(menuGUI.pt2x);
     scene.remove(test);
     P00.x= controlpt2x;
     test =TraceBezierQuadratique(P00, P11, P22, 100,"#0000FF",5);
     //posCamera();
     scene.add(test);
 });

 guiTraj.add(menuGUI,"pt2y",-18,18).onChange(function () {
     let controlpt2y = Math.floor(menuGUI.pt2y);
     scene.remove(test);
     P00.y= controlpt2y;
     test =TraceBezierQuadratique(P00, P11, P22, 100,"#0000FF",5);
     //posCamera();
     scene.add(test);
 });



 //ajout du menu pour actualiser l'affichage
 gui.add(menuGUI, "commencer");
 gui.add(menuGUI, "Lancer");
 gui.add(menuGUI, "actualisation");
 menuGUI.actualisation();
 //********************************************************
 //
 //  F I N     M E N U     G U I
 //
 //********************************************************
 renduAnim();

  // definition des fonctions idoines
 function posCamera(){
  camera.position.set(menuGUI.cameraxPos*testZero(menuGUI.cameraZoom),menuGUI.camerayPos*testZero(menuGUI.cameraZoom),menuGUI.camerazPos*testZero(menuGUI.cameraZoom));
  camera.lookAt(menuGUI.cameraxDir,menuGUI.camerayDir,menuGUI.camerazDir);
  actuaPosCameraHTML();
 }

 function actuaPosCameraHTML(){
  document.forms["controle"].PosX.value=testZero(menuGUI.cameraxPos);
  document.forms["controle"].PosY.value=testZero(menuGUI.camerayPos);
  document.forms["controle"].PosZ.value=testZero(menuGUI.camerazPos);
  document.forms["controle"].DirX.value=testZero(menuGUI.cameraxDir);
  document.forms["controle"].DirY.value=testZero(menuGUI.camerayDir);
  document.forms["controle"].DirZ.value=testZero(menuGUI.camerazDir);
 } // fin fonction posCamera
  // ajoute le rendu dans l'element HTML
 document.getElementById("webgl").appendChild(rendu.domElement);

  // affichage de la scene
 rendu.render(scene, camera);


 function reAffichage() {
   setTimeout(function () {
     if(xyz==1){
       if(g1) scene.remove(g1);
       g1=galet("#880000");
       var tabPt = new Array(test.getPoints(40));
       pos = BezTab(scene,40,tabPt,"#FF0000",2);
       g1.position.set(pos.x, pos.y, 0.75);
       scene.add(g1);
       xyz=0;
     }
  }, 200);// fin setTimeout(function ()
    // rendu avec requestAnimationFrame
  rendu.render(scene, camera);
 }// fin fonction reAffichage()


  function renduAnim() {
    stats.update();
    // rendu avec requestAnimationFrame
    requestAnimationFrame(renduAnim);
// ajoute le rendu dans l'element HTML
    rendu.render(scene, camera);
  }

  function maison(scene) {
    const r1 = new THREE.RingGeometry( 0.0001, 1, 32 );
    const material1 = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.DoubleSide } );
    const mesh1 = new THREE.Mesh( r1, material1 );
    mesh1.position.z = 0.1;
    mesh1.position.x = -25;
    scene.add( mesh1 );

    const r2 = new THREE.RingGeometry( 2, 3, 32 );
    const material2 = new THREE.MeshBasicMaterial( { color: 0x0000FF, side: THREE.DoubleSide } );
    const mesh2 = new THREE.Mesh( r2, material2 );
    mesh2.position.z = 0.1;
    mesh2.position.x = -25;
    scene.add( mesh2 );
  }

  function ligne(scene) {
    let Pts1 = new THREE.Vector3(-20,10,0);
    let Pts2 = new THREE.Vector3(-20,-10,0);
    let Pts3 = new THREE.Vector3(20,-10,0);
    let Pts4 = new THREE.Vector3(20,10,0);

    let Pts5 = new THREE.Vector3(20,0,0);
    let Pts6 = new THREE.Vector3(30,0,0);

    tracePt(scene, Pts1, "#000000",0.1);
    tracePt(scene, Pts2, "#000000",0.1);
    tracePt(scene, Pts3, "#000000",0.1);
    tracePt(scene, Pts4, "#000000",0.1);

    segment(scene,Pts1,Pts2,"#FF0000",5);
    segment(scene,Pts3,Pts4,"#FFFFFF",10);
    segment(scene,Pts5,Pts6,"#FFFFFF",10);
  }

  function segment(MaScene,A,B,CoulHexa,epai){
   var geometry = new THREE.Geometry();
   geometry.vertices.push(A,B);
   var line = new THREE.Line(geometry, new THREE.LineDashedMaterial({
       color: CoulHexa,
       linewidth: epai,
   }));
   scene.add(line );
  }


  function balais(){
    let geobox = new THREE.BoxGeometry( 5, 1, 1 );
    let matbox = new THREE.MeshBasicMaterial( {color: 0x0000AA} );
    let cube = new THREE.Mesh( geobox, matbox );
    cube.translateZ(2.6);  // 0.6

    let geocyl = new THREE.CylinderGeometry( 0.15, 0.15, 10, 32 );
    let matcyl = new THREE.MeshBasicMaterial( {color: 0x111177} );
    let cylinder = new THREE.Mesh( geocyl, matcyl );
    cylinder.translateZ(7);  // 4
    cylinder.translateY(2.3);
    cylinder.rotateX(3.14/3);

    let geocone1 = new THREE.CylinderGeometry( 0.5, 0, 1, 32 );
    let matcone1 = new THREE.MeshBasicMaterial( {color: 0x111177} );
    let cone1 = new THREE.Mesh( geocone1, matcone1 );
    cone1.rotateX(3.14/2);
    cone1.translateX(-2);
    cone1.translateY(1.6);
    let geocone2 = new THREE.CylinderGeometry( 0.5, 0, 1, 32 );
    let matcone2 = new THREE.MeshBasicMaterial( {color: 0x111177} );
    let cone2 = new THREE.Mesh( geocone2, matcone2 );
    cone2.rotateX(3.14/2);
    cone2.translateX(-1);
    cone2.translateY(1.6);
    let geocone3 = new THREE.CylinderGeometry(0.5, 0, 1, 32 );
    let matcone3 = new THREE.MeshBasicMaterial( {color: 0x111177} );
    let cone3 = new THREE.Mesh( geocone3, matcone3 );
    cone3.rotateX(3.14/2);
    cone3.translateX(0);
    cone3.translateY(1.6);
    let geocone4 = new THREE.CylinderGeometry( 0.5, 0, 1, 32 );
    let matcone4 = new THREE.MeshBasicMaterial( {color: 0x111177} );
    let cone4 = new THREE.Mesh( geocone4, matcone4 );
    cone4.rotateX(3.14/2);
    cone4.translateX(1);
    cone4.translateY(1.6);
    let geocone5 = new THREE.CylinderGeometry( 0.5, 0, 1, 32 );
    let matcone5 = new THREE.MeshBasicMaterial( {color: 0x111177} );
    let cone5 = new THREE.Mesh( geocone5, matcone5 );
    cone5.rotateX(3.14/2);
    cone5.translateX(2);
    cone5.translateY(1.6);

    let balai = new THREE.Group();
    balai.add( cube );
    balai.add( cylinder );
    balai.add( cone1 );
    balai.add( cone2 );
    balai.add( cone3 );
    balai.add( cone4 );
    balai.add( cone5 );
    return balai;
  }

  function galet(coul){
    let coef = 1;// pour la jointure G1
    let origine = new THREE.Vector3(0,0,0);
    let P0 = new THREE.Vector3(0,0.5,0);
    let P1 = new THREE.Vector3(0.25,0.5,0);
    let P2 = new THREE.Vector3(1,0.5,0);
    let P3 = new THREE.Vector3(1,0,0);
    let M0 = new THREE.Vector3(P3.x,P3.y,0);
    let M1 = new THREE.Vector3(0,0,0);
    let M2 = new THREE.Vector3(0.5,-0.5,0);
    let M3 = new THREE.Vector3(0,-0.5,0);
    let vP2P3 = new THREE.Vector3(0,0,0);
    let vTan2 = new THREE.Vector3(0,0,0);
    vP2P3.subVectors(P3,P2);//P3-P2
    vTan2.addScaledVector(vP2P3,coef);
    M1.addVectors(M0,vTan2);
    let nb=100;//nmbre de pts par courbe
    let epai=2;//epaisseur de la courbe
    let nbPtCB=50;//nombre de points sur la courbe de Bezier
    let nbePtRot=150;// nbe de points sur les cercles
    let dimPt=0.05;
    tracePt(scene, P0, "#008888",dimPt,false);
    tracePt(scene, P1, "#008888",dimPt,false);
    tracePt(scene, P2, "#008888",dimPt,false);
    tracePt(scene, P3, "#880000",dimPt,false);
    let ptM1 = tracePt(scene, M1, "#000088",dimPt,false);
    tracePt(scene, M2, "#880088",dimPt,false);
    tracePt(scene, M3, "#880088",dimPt,false);
    let nbPts = 100;//nbe de pts de la courbe de Bezier
    let epaiB = 5;//epaisseur de la courbe de Bezier
    let cbeBez2 = TraceBezierCubique(M0, M1, M2, M3,nbPts,"#0000FF",epaiB);
    let cbeBez1 = TraceBezierCubique(P0, P1, P2, P3,nbPts,"#FF00FF",epaiB);
    scene.add(cbeBez1);
    scene.add(cbeBez2);
     let lathe1 = latheBez3(nbPtCB,nbePtRot,P0,P1,P2,P3,"#334444",0.95,false);
     let lathe2 = latheBez3(nbPtCB,nbePtRot,M0,M1,M2,M3,"#334444",0.95,false);
     lathe1.translateY(0.28);
     lathe2.translateY(-0.25);

     let cyl = new THREE.CylinderGeometry( 1, 1, 0.5, 32 );
     let matcylindre = new THREE.MeshBasicMaterial( {color: coul} );
     let cylin = new THREE.Mesh( cyl, matcylindre );

     let galet = new THREE.Group();
     galet.add( lathe1 );
     galet.add( lathe2 );
     galet.add( cylin );
     galet.rotateX(3.14/2);
     return galet;
  }

  function traceRectiligne(yFinal){
    let matline = new THREE.LineBasicMaterial({ color: 0xFF6600 });
    let points = [];
    points.push( new THREE.Vector3( 22, 0, 0.75 ) );
    points.push( new THREE.Vector3( -20, yFinal, 0.75 ) );
    const geometline = new THREE.BufferGeometry().setFromPoints( points );
    const linetraj = new THREE.Line( geometline, matline );
    return linetraj;
  }

  function commencer(){
    com=1;
    g1.position.set(20, 0, 0.75);
  }

  function Lancer(){
    if(com=1){
      xyz=1;
      reAffichage();
    }
  }


} // fin fonction init()
