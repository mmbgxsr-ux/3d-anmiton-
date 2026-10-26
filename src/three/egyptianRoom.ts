import * as THREE from 'three';

/**
 * Egyptian Study Room 3D Environment
 * Includes wooden study desk, authentic Egyptian math homework notebook ("كشكول سلك"),
 * books, vintage desk lamp with warm spotlight, Cairo window with moon silhouette,
 * Pyramids wall painting, and traditional patterned rug.
 */
export class EgyptianRoom {
  public group: THREE.Group;
  public deskLampLight: THREE.SpotLight;
  public notebookMesh: THREE.Mesh;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'Egyptian_Study_Room';

    // 1. Room Floor
    const floorGeo = new THREE.PlaneGeometry(8, 8);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x8b5a2b, // Warm parquet wood floor
      roughness: 0.65,
      metalness: 0.05,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI * 0.5;
    floor.receiveShadow = true;
    this.group.add(floor);

    // Traditional Egyptian geometric patterned rug
    const rugCanvas = document.createElement('canvas');
    rugCanvas.width = 512;
    rugCanvas.height = 512;
    const rCtx = rugCanvas.getContext('2d')!;
    rCtx.fillStyle = '#b91c1c';
    rCtx.fillRect(0, 0, 512, 512);
    // Patterns
    rCtx.strokeStyle = '#fef08a';
    rCtx.lineWidth = 12;
    rCtx.strokeRect(20, 20, 472, 472);
    rCtx.strokeStyle = '#1e3a8a';
    rCtx.lineWidth = 8;
    rCtx.strokeRect(40, 40, 432, 432);
    // Diamond center
    rCtx.fillStyle = '#d97706';
    rCtx.beginPath();
    rCtx.moveTo(256, 80);
    rCtx.lineTo(432, 256);
    rCtx.lineTo(256, 432);
    rCtx.lineTo(80, 256);
    rCtx.closePath();
    rCtx.fill();
    rCtx.stroke();

    const rugTex = new THREE.CanvasTexture(rugCanvas);
    rugTex.colorSpace = THREE.SRGBColorSpace;
    const rugMat = new THREE.MeshStandardMaterial({
      map: rugTex,
      roughness: 0.9,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), rugMat);
    rug.rotation.x = -Math.PI * 0.5;
    rug.position.set(0, 0.005, 0.4);
    rug.receiveShadow = true;
    this.group.add(rug);

    // 2. Room Walls
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Deep nocturnal room wall with warm ambient feel
      roughness: 0.85,
    });

    // Back Wall
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(8, 4.5), wallMat);
    backWall.position.set(0, 2.25, -2);
    backWall.receiveShadow = true;
    this.group.add(backWall);

    // Wainscoting baseboard
    const baseboardGeo = new THREE.BoxGeometry(8, 0.15, 0.05);
    const woodTrimMat = new THREE.MeshStandardMaterial({ color: 0x5c3818, roughness: 0.5 });
    const baseboard = new THREE.Mesh(baseboardGeo, woodTrimMat);
    baseboard.position.set(0, 0.075, -1.98);
    this.group.add(baseboard);

    // 3. Cairo Window with Crescent Moon & Skyline
    const windowGroup = new THREE.Group();
    windowGroup.position.set(-1.8, 2.4, -1.98);

    const winCanvas = document.createElement('canvas');
    winCanvas.width = 512;
    winCanvas.height = 512;
    const wCtx = winCanvas.getContext('2d')!;

    // Egyptian twilight sky gradient
    const skyGrad = wCtx.createLinearGradient(0, 0, 0, 512);
    skyGrad.addColorStop(0, '#0c1a30');
    skyGrad.addColorStop(0.6, '#1e3a5f');
    skyGrad.addColorStop(1, '#b45309'); // Warm Cairo dusk glow
    wCtx.fillStyle = skyGrad;
    wCtx.fillRect(0, 0, 512, 512);

    // Crescent Moon
    wCtx.fillStyle = '#fef08a';
    wCtx.beginPath();
    wCtx.arc(380, 100, 32, 0, Math.PI * 2);
    wCtx.fill();
    wCtx.fillStyle = '#112239';
    wCtx.beginPath();
    wCtx.arc(368, 92, 28, 0, Math.PI * 2);
    wCtx.fill();

    // Cairo Minarets & Skyline silhouettes
    wCtx.fillStyle = '#060d17';
    // Cairo tower silhouette
    wCtx.fillRect(120, 140, 16, 372);
    wCtx.beginPath();
    wCtx.arc(128, 140, 18, 0, Math.PI * 2);
    wCtx.fill();
    // Minarets
    wCtx.fillRect(260, 220, 22, 292);
    wCtx.beginPath();
    wCtx.moveTo(271, 160);
    wCtx.lineTo(260, 220);
    wCtx.lineTo(282, 220);
    wCtx.closePath();
    wCtx.fill();
    // City block buildings
    wCtx.fillRect(0, 360, 512, 152);
    // Warm lit windows in distance
    wCtx.fillStyle = '#fde047';
    for (let x = 20; x < 500; x += 30) {
      for (let y = 380; y < 490; y += 25) {
        if (Math.random() > 0.4) {
          wCtx.fillRect(x, y, 8, 12);
        }
      }
    }

    const winTex = new THREE.CanvasTexture(winCanvas);
    winTex.colorSpace = THREE.SRGBColorSpace;
    const winMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 1.8),
      new THREE.MeshBasicMaterial({ map: winTex })
    );
    windowGroup.add(winMesh);

    // Window Frame
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const frameOutline = new THREE.BoxGeometry(1.7, 1.9, 0.04);
    const frameOutlineMesh = new THREE.Mesh(frameOutline, frameMat);
    frameOutlineMesh.position.z = -0.01;
    windowGroup.add(frameOutlineMesh);

    // Cross panes
    const paneH = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.04, 0.06), frameMat);
    const paneV = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.8, 0.06), frameMat);
    windowGroup.add(paneH, paneV);
    this.group.add(windowGroup);

    // 4. Egyptian Pyramids Wall Art (Cartoon Frame)
    const artGroup = new THREE.Group();
    artGroup.position.set(1.5, 2.5, -1.98);

    const artCanvas = document.createElement('canvas');
    artCanvas.width = 512;
    artCanvas.height = 320;
    const aCtx = artCanvas.getContext('2d')!;

    // Golden sunset gradient
    const sunGrad = aCtx.createLinearGradient(0, 0, 0, 320);
    sunGrad.addColorStop(0, '#f59e0b');
    sunGrad.addColorStop(0.5, '#f97316');
    sunGrad.addColorStop(1, '#78350f');
    aCtx.fillStyle = sunGrad;
    aCtx.fillRect(0, 0, 512, 320);

    // Stylized cartoon Pyramids of Giza
    aCtx.fillStyle = '#b45309';
    // Great Pyramid
    aCtx.beginPath();
    aCtx.moveTo(180, 90);
    aCtx.lineTo(60, 260);
    aCtx.lineTo(300, 260);
    aCtx.closePath();
    aCtx.fill();
    // Shaded face
    aCtx.fillStyle = '#92400e';
    aCtx.beginPath();
    aCtx.moveTo(180, 90);
    aCtx.lineTo(230, 260);
    aCtx.lineTo(300, 260);
    aCtx.closePath();
    aCtx.fill();

    // Second Pyramid
    aCtx.fillStyle = '#d97706';
    aCtx.beginPath();
    aCtx.moveTo(340, 130);
    aCtx.lineTo(240, 260);
    aCtx.lineTo(440, 260);
    aCtx.closePath();
    aCtx.fill();

    // Sand ground
    aCtx.fillStyle = '#eab308';
    aCtx.fillRect(0, 260, 512, 60);

    const artTex = new THREE.CanvasTexture(artCanvas);
    artTex.colorSpace = THREE.SRGBColorSpace;
    const artMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 0.95),
      new THREE.MeshStandardMaterial({ map: artTex, roughness: 0.3 })
    );
    artGroup.add(artMesh);

    // Gold Frame
    const artFrameMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Egyptian gold
      metalness: 0.85,
      roughness: 0.25,
    });
    const artFrame = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.05, 0.04), artFrameMat);
    artFrame.position.z = -0.02;
    artGroup.add(artFrame);
    this.group.add(artGroup);

    // 5. The Study Desk (Main Stage)
    const deskGroup = new THREE.Group();
    deskGroup.position.set(0, 0, 0);

    // Desk Top (Sturdy polished wood)
    const topGeo = new THREE.BoxGeometry(2.1, 0.08, 1.1);
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x6d4c41, // Warm rich walnut wood
      roughness: 0.45,
      metalness: 0.05,
    });
    const deskTop = new THREE.Mesh(topGeo, deskMat);
    deskTop.position.set(0, 0.76, 0);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    deskGroup.add(deskTop);

    // Desk Legs
    const legGeo = new THREE.CylinderGeometry(0.04, 0.035, 0.72, 12);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.6 });
    const legPositions = [
      [-0.95, 0.36, -0.45],
      [0.95, 0.36, -0.45],
      [-0.95, 0.36, 0.45],
      [0.95, 0.36, 0.45],
    ];
    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      deskGroup.add(leg);
    });

    // Desk Drawer
    const drawerGeo = new THREE.BoxGeometry(0.7, 0.14, 0.7);
    const drawer = new THREE.Mesh(drawerGeo, deskMat);
    drawer.position.set(0.5, 0.65, 0);
    deskGroup.add(drawer);

    const handleGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.12, 8);
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.2 });
    const handle = new THREE.Mesh(handleGeo, brassMat);
    handle.rotation.z = Math.PI * 0.5;
    handle.position.set(0.5, 0.65, 0.36);
    deskGroup.add(handle);

    // 6. Egyptian Homework Notebook ("كشكول سلك - رياضيات")
    const noteCanvas = document.createElement('canvas');
    noteCanvas.width = 512;
    noteCanvas.height = 360;
    const nCtx = noteCanvas.getContext('2d')!;

    // Lined Egyptian paper
    nCtx.fillStyle = '#f8fafc';
    nCtx.fillRect(0, 0, 512, 360);

    // Center crease line
    nCtx.strokeStyle = '#cbd5e1';
    nCtx.lineWidth = 4;
    nCtx.beginPath();
    nCtx.moveTo(256, 0);
    nCtx.lineTo(256, 360);
    nCtx.stroke();

    // Red margin line on right (Arabic RTL notebook standard)
    nCtx.strokeStyle = '#ef4444';
    nCtx.lineWidth = 3;
    nCtx.beginPath();
    nCtx.moveTo(460, 0);
    nCtx.lineTo(460, 360);
    nCtx.stroke();

    // Blue horizontal writing lines
    nCtx.strokeStyle = '#93c5fd';
    nCtx.lineWidth = 1.5;
    for (let y = 40; y < 350; y += 28) {
      nCtx.beginPath();
      nCtx.moveTo(20, y);
      nCtx.lineTo(500, y);
      nCtx.stroke();
    }

    // Handwritten Arabic Math Homework text
    nCtx.fillStyle = '#1e3a8a';
    nCtx.font = 'bold 20px "Cairo", sans-serif';
    nCtx.textAlign = 'right';
    nCtx.direction = 'rtl';
    nCtx.fillText('كشكول واجب الرياضيات', 450, 35);

    nCtx.font = '16px "Cairo", sans-serif';
    nCtx.fillStyle = '#0f172a';
    nCtx.fillText('س١: احسب حاصل ضرب ١٥ × ٤ = ٦٠', 450, 70);
    nCtx.fillText('س٢: قسمة ١٢٠ ÷ ٣ = ٤٠', 450, 105);

    // The comedic tricky question in red!
    nCtx.fillStyle = '#dc2626';
    nCtx.font = 'bold 22px "Cairo", sans-serif';
    nCtx.fillText('س٣ (المسألة الصعبة!):', 450, 160);
    nCtx.font = 'bold 26px "Cairo", sans-serif';
    nCtx.fillText('١ + ١ = ؟؟؟؟', 420, 205);

    // Left page doodle / math sketch
    nCtx.strokeStyle = '#2563eb';
    nCtx.lineWidth = 2;
    nCtx.strokeRect(60, 80, 140, 100);
    nCtx.font = '14px sans-serif';
    nCtx.textAlign = 'center';
    nCtx.fillText('📐 هندسة', 130, 135);

    const noteTex = new THREE.CanvasTexture(noteCanvas);
    noteTex.colorSpace = THREE.SRGBColorSpace;
    const noteGeo = new THREE.PlaneGeometry(0.55, 0.38);
    const noteMat = new THREE.MeshStandardMaterial({
      map: noteTex,
      roughness: 0.8,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    this.notebookMesh = new THREE.Mesh(noteGeo, noteMat);
    this.notebookMesh.rotation.x = -Math.PI * 0.5;
    this.notebookMesh.position.set(0, 0.805, 0.08);
    this.notebookMesh.receiveShadow = true;
    deskGroup.add(this.notebookMesh);

    // Spiral wire on notebook edge
    const wireGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.36, 16);
    const wire = new THREE.Mesh(wireGeo, brassMat);
    wire.rotation.x = Math.PI * 0.5;
    wire.position.set(0, 0.81, 0.08);
    deskGroup.add(wire);

    // 7. Stack of Egyptian Textbooks
    const bookColors = [0x0284c7, 0x16a34a, 0xe11d48];
    bookColors.forEach((color, idx) => {
      const bookGeo = new THREE.BoxGeometry(0.28, 0.04, 0.22);
      const bookMat = new THREE.MeshStandardMaterial({ color, roughness: 0.6 });
      const book = new THREE.Mesh(bookGeo, bookMat);
      book.position.set(-0.7, 0.82 + idx * 0.042, -0.2);
      book.rotation.y = idx * 0.12 - 0.05;
      book.castShadow = true;
      deskGroup.add(book);
    });

    // 8. Pencil Mug / Holder with colored pens & ruler
    const mugGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.14, 16);
    const mugMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.3 });
    const mug = new THREE.Mesh(mugGeo, mugMat);
    mug.position.set(-0.72, 0.87, 0.2);
    mug.castShadow = true;
    deskGroup.add(mug);

    // Pens inside mug
    const penMat1 = new THREE.MeshStandardMaterial({ color: 0xef4444 });
    const penMat2 = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });
    const penMat3 = new THREE.MeshStandardMaterial({ color: 0x10b981 });
    const penGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.18, 8);

    const pen1 = new THREE.Mesh(penGeo, penMat1);
    pen1.position.set(-0.74, 0.94, 0.19);
    pen1.rotation.set(0.2, 0, 0.1);

    const pen2 = new THREE.Mesh(penGeo, penMat2);
    pen2.position.set(-0.71, 0.95, 0.22);
    pen2.rotation.set(-0.15, 0.3, -0.2);

    const pen3 = new THREE.Mesh(penGeo, penMat3);
    pen3.position.set(-0.7, 0.93, 0.18);
    pen3.rotation.set(0.1, -0.2, 0.15);

    // Triangle ruler in mug
    const rulerGeo = new THREE.BoxGeometry(0.01, 0.22, 0.05);
    const rulerMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.8,
      roughness: 0.2,
    });
    const ruler = new THREE.Mesh(rulerGeo, rulerMat);
    ruler.position.set(-0.73, 0.95, 0.21);
    ruler.rotation.z = -0.25;
    deskGroup.add(mug, pen1, pen2, pen3, ruler);

    // 9. Retro Egyptian Desk Study Lamp with warm spotlight
    const lampGroup = new THREE.Group();
    lampGroup.position.set(0.72, 0.8, -0.25);

    const lampBaseGeo = new THREE.CylinderGeometry(0.09, 0.1, 0.025, 16);
    const lampMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.2,
    });
    const lampBase = new THREE.Mesh(lampBaseGeo, lampMat);
    lampGroup.add(lampBase);

    // Lamp curved arm (brass gooseneck)
    const armGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.35, 12);
    const lampArm = new THREE.Mesh(armGeo, brassMat);
    lampArm.position.set(-0.06, 0.16, 0.04);
    lampArm.rotation.set(0.3, 0, 0.4);
    lampGroup.add(lampArm);

    // Lamp Shade (Bell shape)
    const shadeGeo = new THREE.ConeGeometry(0.12, 0.15, 16, 1, true);
    const lampShade = new THREE.Mesh(shadeGeo, lampMat);
    lampShade.position.set(-0.18, 0.32, 0.14);
    lampShade.rotation.set(Math.PI * 0.7, 0, -0.4);
    lampGroup.add(lampShade);

    // Glowing Bulb inside shade
    const bulbGeo = new THREE.SphereGeometry(0.035, 12, 12);
    const bulbMat = new THREE.MeshStandardMaterial({
      color: 0xffedd5,
      emissive: 0xffedd5,
      emissiveIntensity: 2.0,
      roughness: 0.1,
    });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.set(-0.18, 0.3, 0.14);
    lampGroup.add(bulb);

    // Warm Amber SpotLight illuminating the notebook
    this.deskLampLight = new THREE.SpotLight(0xffb74d, 5.5, 3.5, Math.PI * 0.32, 0.4, 1.2);
    this.deskLampLight.position.set(-0.18, 0.3, 0.14);
    this.deskLampLight.target.position.set(-0.7, -0.3, 0.3);
    this.deskLampLight.castShadow = true;
    this.deskLampLight.shadow.bias = -0.0005;
    lampGroup.add(this.deskLampLight);
    lampGroup.add(this.deskLampLight.target);

    deskGroup.add(lampGroup);

    this.group.add(deskGroup);
  }
}
