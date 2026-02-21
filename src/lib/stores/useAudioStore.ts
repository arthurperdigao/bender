/**
 * src/store/useAudioStore.ts
 *
 * Gerencia toda a sonoplastia da plataforma usando Howler.js.
 * Centraliza a lógica de áudio para fácil controle.
 */
import { create } from 'zustand';
import { Howl } from 'howler';

// Interface para nossos sons
interface SoundMap {
  [key: string]: Howl;
}

// Pré-carrega os sons de UI mais comuns
const uiSounds: SoundMap = {
  // Som de "pincelada" para transição de pergunta
  scroll_open: new Howl({ src: ['/assets/sounds/ui/scroll_open.mp3'], volume: 0.5 }),
  // Clique temático (pedra/madeira)
  default_click: new Howl({ src: ['/assets/sounds/ui/default_click.mp3'], volume: 0.7 }),
  // Som para a tela de resultado
  reveal_chime: new Howl({ src: ['/assets/sounds/ui/reveal_chime.mp3'], volume: 0.8 }),
};

// Armazena sons "dinâmicos" (ex: temas de resultado)
const dynamicSounds: SoundMap = {};
let currentMusic: Howl | null = null;

interface AudioState {
  playSfx: (soundName: string, path?: string) => void;
  playMusic: (trackName: string, path: string) => void;
  stopMusic: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  /**
   * Toca um Efeito Sonoro (SFX).
   * @param soundName - O nome/chave do som (ex: 'default_click')
   * @param path - (Opcional) O caminho para o áudio, se for um som dinâmico.
   */
  playSfx: (soundName, path) => {
    let sound = uiSounds[soundName] || dynamicSounds[soundName];

    if (sound) {
      sound.play();
    } else if (path) {
      // Se o som não foi carregado, carrega dinamicamente
      sound = new Howl({ src: [path], volume: 0.7 });
      dynamicSounds[soundName] = sound;
      sound.play();
    } else {
      console.warn(`SFX não encontrado: ${soundName}`);
    }
  },

  /**
   * Toca uma Música (para tudo o que estiver tocando).
   * @param trackName - O nome/chave da música (ex: 'quiz_ambient')
   * @param path - O caminho para o arquivo de música.
   */
  playMusic: (trackName, path) => {
    get().stopMusic(); // Para a música anterior

    let music = dynamicSounds[trackName];
    if (music) {
      music.play();
    } else {
      music = new Howl({
        src: [path],
        loop: true,
        volume: 0.4,
      });
      dynamicSounds[trackName] = music;
      music.play();
    }
    currentMusic = music;
  },

  /**
   * Para a música que está tocando atualmente.
   */
  stopMusic: () => {
    if (currentMusic) {
      currentMusic.stop();
      currentMusic = null;
    }
  },
}));