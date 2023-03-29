/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => ObsidianToFlomo
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  flomoAPI: ""
};
var ObsidianToFlomo = class extends import_obsidian.Plugin {
  async onload() {
    await this.loadSettings();
    this.addCommand({
      id: "send-to-flome-all",
      name: "Send current content to Flomo",
      editorCallback: (editor, view) => {
        this.checkResult = this.checkSettings();
        if (this.checkResult) {
          new sendFlomeAPI(this.app, this).sendRequest(editor.getSelection(), "The current content has been sent to Flomo");
        }
      }
    });
    this.addCommand({
      id: "send-to-flome-selected",
      name: "Send selected content to Flomo",
      editorCallback: (editor, view) => {
        this.checkResult = this.checkSettings();
        if (this.checkResult) {
          new sendFlomeAPI(this.app, this).sendRequest(editor.getSelection(), "The selection has been sent to Flomo");
        }
      }
    });
    this.addSettingTab(new SampleSettingTab(this.app, this));
  }
  onunload() {
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  checkSettings() {
    if (this.settings.flomoAPI == "") {
      new import_obsidian.Notice("Please set Flomo API first");
      return false;
    }
    return true;
  }
};
var sendFlomeAPI = class {
  constructor(app, plugin) {
    this.plugin = plugin;
  }
  async sendRequest(text, successMsg) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", this.plugin.settings.flomoAPI);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
      "content": text
    }));
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        console.log(xhr.responseText);
        try {
          const json = JSON.parse(xhr.responseText);
          console.log(json);
          if (json.code == 0) {
            new import_obsidian.Notice(successMsg);
          } else if (json.code == -1) {
            new import_obsidian.Notice(json.message + "please check your settings");
          } else {
            new import_obsidian.Notice("please check your settings");
          }
        } catch (e) {
          new import_obsidian.Notice("please check your settings");
        }
      }
    };
  }
};
var SampleSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Settings" });
    new import_obsidian.Setting(containerEl).setName("Flomo API").setDesc("The plugin does not save your API key, it is only used to send requests.").addText((text) => text.setPlaceholder("https://flomoapp.com/iwh/xxxxxx/xxxxxx/").setValue(this.plugin.settings.flomoAPI).onChange(async (value) => {
      this.plugin.settings.flomoAPI = value;
      await this.plugin.saveSettings();
    }));
    containerEl.createEl("button", { text: "Send a test request" }).addEventListener("click", () => {
      new sendFlomeAPI(this.app, this.plugin).sendRequest("This is a test request", "The test request has been sent to Flomo");
    });
  }
};
