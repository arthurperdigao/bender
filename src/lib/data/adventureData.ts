/**
 * src/lib/data/adventureData.ts
 *
 * Roteiro e estrutura da "Jornada do Destino".
 * Uma experiência narrativa interativa no universo Avatar.
 */

export interface AdventureChoice {
    text: string;
    nextSceneId: string;
    elementPoints?: {
        water?: number;
        earth?: number;
        fire?: number;
        air?: number;
    };
}

export interface AdventureScene {
    id: string;
    text: string;
    background: string;
    character?: {
        name: string;
        image?: string;
        position: 'left' | 'right' | 'center';
    };
    choices: AdventureChoice[];
}

export const adventureData: Record<string, AdventureScene> = {
    start: {
        id: 'start',
        text: 'O sol se põe lentamente sobre as montanhas escarpadas do Reino da Terra. Enquanto caminha por uma trilha solitária, algo brilhante entre as raízes de uma árvore milenar chama sua atenção: é um pingente antigo, entalhado com os quatro símbolos elementares.',
        background: '/assets/adventure/earth_sunset.png',
        choices: [
            {
                text: 'Recolher o pingente com cuidado.',
                nextSceneId: 'pick_up_pendant',
                elementPoints: { air: 1, water: 1 }
            },
            {
                text: 'Ignorar o objeto. Pode ser uma armadilha ou algo sagrado.',
                nextSceneId: 'leave_pendant',
                elementPoints: { earth: 1 }
            }
        ]
    },
    pick_up_pendant: {
        id: 'pick_up_pendant',
        text: 'Assim que seus dedos tocam o metal frio, uma visão avassaladora atravessa sua mente. Você vê o mundo em chamas e, logo em seguida, submerso por ondas gigantescas. Uma voz suave sussurra: "O equilíbrio do mundo está em suas mãos, jovem viajante."',
        background: '/assets/adventure/spirit_vision.png',
        character: {
            name: 'Visão de Aang',
            image: '/assets/adventure/aang_vision.png',
            position: 'center'
        },
        choices: [
            {
                text: '"Quem está aí? Apareça!"',
                nextSceneId: 'confront_voice',
                elementPoints: { fire: 1 }
            },
            {
                text: 'Fechar os olhos e tentar ouvir o que a voz tem a dizer.',
                nextSceneId: 'listen_to_voice',
                elementPoints: { air: 1 }
            }
        ]
    },
    leave_pendant: {
        id: 'leave_pendant',
        text: 'Você decide seguir em frente, respeitando o mistério da floresta. No entanto, ao dobrar a próxima curva, o cenário parece ter se transformado. As árvores não são as mesmas e uma névoa densa começa a brotar do solo.',
        background: '/assets/adventure/forest_mist.png',
        choices: [
            {
                text: 'Tentar voltar pelo caminho original.',
                nextSceneId: 'lost_in_mist',
                elementPoints: { earth: 1 }
            },
            {
                text: 'Gritar por ajuda.',
                nextSceneId: 'shout_for_help',
                elementPoints: { water: 1 }
            }
        ]
    },
    lost_in_mist: {
        id: 'lost_in_mist',
        text: 'Você tenta retornar, mas a névoa é espessa demais. Silhuetas estranhas parecem se mover entre os troncos milenares. De repente, você tropeça e cai em um círculo de cogumelos brilhantes: um portal para o mundo espiritual.',
        background: '/assets/adventure/forest_mist.png',
        choices: [
            {
                text: 'Atravessar o portal de luz.',
                nextSceneId: 'spirit_destination',
                elementPoints: { air: 1 }
            }
        ]
    },
    shout_for_help: {
        id: 'shout_for_help',
        text: 'Seu grito ecoa pela floresta silenciosa. Por um longo tempo, nada acontece. Então, um lêmure voador desce das copas das árvores e pousa suavemente em seu ombro, indicando o caminho com a cauda.',
        background: '/assets/adventure/forest_mist.png',
        character: {
            name: 'Espírito Guia',
            image: '/assets/adventure/spirit_lemur.png',
            position: 'center'
        },
        choices: [
            {
                text: 'Seguir o pequeno guia espiritual.',
                nextSceneId: 'spirit_destination',
                elementPoints: { water: 1 }
            }
        ]
    },
    confront_voice: {
        id: 'confront_voice',
        text: 'De trás de uma árvore centenária, um espírito em forma de lêmure voador surge, observando você com olhos sábios. "Não tenha medo", diz ele, sem que seus lábios se movam. "Eu sou um guia deste bosque sagrado."',
        background: '/assets/adventure/forest_mist.png',
        character: {
            name: 'Espírito do Bosque',
            image: '/assets/adventure/spirit_lemur.png',
            position: 'center'
        },
        choices: [
            {
                text: '"Para onde você pretende me levar?"',
                nextSceneId: 'spirit_destination',
                elementPoints: { air: 1 }
            }
        ]
    },
    listen_to_voice: {
        id: 'listen_to_voice',
        text: 'A voz se torna cristalina em sua mente: "O portal espiritual está enfraquecendo. Somente aqueles que compreendem a harmonia podem deter o caos que se aproxima."',
        background: '/assets/adventure/spirit_vision.png',
        choices: [
            {
                text: '"Como posso ajudar a restaurar a ordem?"',
                nextSceneId: 'spirit_destination',
                elementPoints: { water: 1 }
            }
        ]
    },
    spirit_destination: {
        id: 'spirit_destination',
        text: 'O espírito aponta para o Norte, onde uma aurora boreal brilha intensamente, mesmo com o sol ainda visível. "Vá até o Oásis Espiritual. Lá, você descobrirá sua verdadeira natureza."',
        background: '/assets/adventure/spirit_portal.png',
        choices: [
            {
                text: 'Iniciar a jornada para o Norte.',
                nextSceneId: 'end_demo',
                elementPoints: { fire: 1, earth: 1, water: 1, air: 1 }
            }
        ]
    },
    end_demo: {
        id: 'end_demo',
        text: 'Sua jornada acaba de começar. O destino das nações dependerá das suas futuras escolhas e da força do elemento que desperta em seu interior.',
        background: '/assets/adventure/spirit_vision.png',
        character: {
            name: 'O Destino',
            image: '/assets/adventure/korra_vision.png',
            position: 'center'
        },
        choices: [
            {
                text: 'Recomeçar Jornada',
                nextSceneId: 'start'
            },
            {
                text: 'Voltar ao Portal',
                nextSceneId: 'exit'
            }
        ]
    },
};
