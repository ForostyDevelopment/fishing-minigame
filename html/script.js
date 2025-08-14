class FishingMinigame {
  constructor(settings = {}) {
    const defaults = {
      gravity: -0.1,
      lift: 0.1,
      maxBarSpeed: 2,
      fishMaxSpeed: 2,
      fishAccel: 0.05,
      fillRate: 0.09,
      drainRate: 0.08,
      bounceDamping: 0.85,
      stopThreshold: 0.05,
      startCatchPercent: 20,
      barHeightPercent: 20
    };
    this.settings = { ...defaults, ...settings };

    this.greenBar = document.getElementById("green-bar");
    this.box = document.getElementById("fish-box");
    this.fishCircle = document.getElementById("fish-circle");
    this.catchFill = document.getElementById("catch-fill");

    this.greenBar.style.height = `${this.settings.barHeightPercent}%`;

    this.isMouseDown = false;
    this.barPosition = 0;
    this.barVelocity = 0;
    this.fishPos = 0;
    this.fishVel = 0;
    this.catchProgress = this.settings.startCatchPercent;
    this.gameActive = false;
    this.resolveResult = null;

    document.addEventListener("mousedown", () => this.isMouseDown = true);
    document.addEventListener("mouseup", () => this.isMouseDown = false);
    document.addEventListener("keydown", e => { if (e.key === "Escape") this.endGame(false); });
  }

  startGame() {
    this.barPosition = 0;
    this.barVelocity = 0;
    this.greenBar.style.bottom = "0px";

    this.fishPos = (this.box.offsetHeight - this.fishCircle.offsetHeight) / 2;
    this.fishVel = 0;
    this.fishCircle.style.top = `${this.fishPos}px`;

    this.catchProgress = this.settings.startCatchPercent;
    this.catchFill.style.height = `${this.catchProgress}%`;

    this.isMouseDown = false;
    this.gameActive = true;
    this.loop();
  }

  endGame(success) {
    if (this.resolveResult) {
      this.resolveResult(success);
      this.resolveResult = null;
    }
    this.gameActive = false;
    document.body.classList.remove("active");
    fetch(`https://${GetParentResourceName()}/closeNui`, { method: "POST" });
  }

  showUi() {
    document.body.classList.add("active");
    this.startGame();
  }

  updateGreenBar() {
    const boxHeight = this.box.offsetHeight;
    const barHeight = (this.settings.barHeightPercent / 100) * boxHeight;
    const maxY = boxHeight - barHeight;

    this.barVelocity += this.isMouseDown ? this.settings.lift : this.settings.gravity;
    this.barVelocity = Math.max(Math.min(this.barVelocity, this.settings.maxBarSpeed), -this.settings.maxBarSpeed);

    this.barPosition += this.barVelocity;

    if (this.barPosition < 0) {
      this.barPosition = 0;
      this.barVelocity *= -this.settings.bounceDamping;
      if (Math.abs(this.barVelocity) < this.settings.stopThreshold) this.barVelocity = 0;
    } else if (this.barPosition > maxY) {
      this.barPosition = maxY;
      this.barVelocity = 0;
    }

    this.greenBar.style.bottom = `${this.barPosition}px`;
  }

  updateFish() {
    const boxHeight = this.box.offsetHeight;
    const fishSize = this.fishCircle.offsetHeight;
    const maxPos = boxHeight - fishSize;
    const minPos = 0;

    this.fishVel += (Math.random() - 0.5) * this.settings.fishAccel;
    this.fishVel = Math.max(Math.min(this.fishVel, this.settings.fishMaxSpeed), -this.settings.fishMaxSpeed);

    this.fishPos += this.fishVel;
    if (this.fishPos < minPos || this.fishPos > maxPos) {
      this.fishPos = Math.max(Math.min(this.fishPos, maxPos), minPos);
      this.fishVel *= -0.5;
    }

    this.fishCircle.style.top = `${this.fishPos}px`;
  }

  updateCatchMeter() {
    const barRect = this.greenBar.getBoundingClientRect();
    const fishRect = this.fishCircle.getBoundingClientRect();
    const isOverlapping = !(barRect.bottom < fishRect.top || barRect.top > fishRect.bottom);

    this.catchProgress += isOverlapping ? this.settings.fillRate : -this.settings.drainRate;
    this.catchProgress = Math.max(0, Math.min(100, this.catchProgress));
    this.catchFill.style.height = `${this.catchProgress}%`;
    this.greenBar.classList.toggle("greener", isOverlapping);

    if (this.catchProgress >= 100 && this.gameActive) this.handleSuccess();
    if (this.catchProgress <= 0 && this.gameActive) this.handleFail();
  }

  loop() {
    if (!this.gameActive) return;
    this.updateGreenBar();
    this.updateFish();
    this.updateCatchMeter();
    requestAnimationFrame(() => this.loop());
  }

  handleSuccess() {
    fetch(`https://${GetParentResourceName()}/fishingResult`, { method: "POST", body: JSON.stringify({ success: true }) });
    this.endGame(true);
  }

  handleFail() {
    fetch(`https://${GetParentResourceName()}/fishingResult`, { method: "POST", body: JSON.stringify({ success: false }) });
    this.endGame(false);
  }

  startFromExport() {
    return new Promise(resolve => {
      this.resolveResult = resolve;
      this.showUi();
    });
  }
}

let fishingInstance = null;
window.startFishingMinigame = difficulty => {
  const settings = { ...config.global, ...config.difficulties[difficulty] };
  fishingInstance = new FishingMinigame(settings);
  return fishingInstance.startFromExport();
};
globalThis.StartFishing = difficulty => window.startFishingMinigame(difficulty);

window.addEventListener("message", event => {
  if (event.data.action === "startFishing") {
    fishingInstance = new FishingMinigame(event.data.difficultySettings);
    fishingInstance.startFromExport();
  }
});