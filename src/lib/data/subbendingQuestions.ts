/**
 * src/lib/data/subbendingQuestions.ts
 *
 * Perguntas do Quiz de Sub-bending — "O Chamado Profundo"
 *
 * PRINCÍPIO DE DESIGN:
 * As perguntas testam PERSONALIDADE, VALORES e INSTINTOS — nunca
 * descrevem poderes diretamente. O usuário não deve conseguir
 * adivinhar o resultado pela leitura das opções.
 */
import { QuizQuestion } from '@/lib/types/avatar';

// ═══════════════════════════════════════════════════════
// ÁGUA — 4 arquétipos:
// WATER_HEALER | WATER_BLOODBENDER | WATER_PLANTBENDER | WATER_MASTER
// ═══════════════════════════════════════════════════════
export const waterSubQuestions: QuizQuestion[] = [
    {
        id: 'water_intro',
        type: 'narrative',
        prompt: 'O oceano não revela seus segredos facilmente. Mas esta noite, as águas estão calmas — e algo dentro de você está prestes a acordar.',
    },
    {
        id: 'water_q1',
        type: 'choice',
        prompt: 'Uma crise acontece perto de você. Qual é sua reação imediata, antes de pensar?',
        options: [
            { id: 'w1a', text: 'Vou direto para quem precisa de ajuda. Meu instinto é aliviar a dor.', scores: { WATER_HEALER: 3 } },
            { id: 'w1b', text: 'Fico imóvel por um instante — sentindo tudo ao redor antes de agir.', scores: { WATER_MASTER: 2, WATER_BLOODBENDER: 1 } },
            { id: 'w1c', text: 'Percebo detalhes que os outros ignoram. Formas, padrões, conexões invisíveis.', scores: { WATER_PLANTBENDER: 3 } },
            { id: 'w1d', text: 'Calculo. Quem controla a situação controla o resultado.', scores: { WATER_BLOODBENDER: 3 } },
        ],
    },
    {
        id: 'water_q2',
        type: 'choice',
        prompt: 'Qual dessas frases ressoa mais com você?',
        options: [
            { id: 'w2a', text: '"Existe beleza em restaurar o que foi quebrado."', scores: { WATER_HEALER: 3 } },
            { id: 'w2b', text: '"Nada me escapa. Eu sinto antes de ver."', scores: { WATER_BLOODBENDER: 3 } },
            { id: 'w2c', text: '"Tudo está conectado — você só precisa saber onde olhar."', scores: { WATER_PLANTBENDER: 3 } },
            { id: 'w2d', text: '"Ser poderoso não é uma opção. É uma responsabilidade."', scores: { WATER_MASTER: 3 } },
        ],
    },
    {
        id: 'water_q3',
        type: 'choice',
        prompt: 'Você está sozinho numa floresta à noite. O que chama sua atenção?',
        options: [
            { id: 'w3a', text: 'O som dos animais — que histórias eles poderiam contar sobre quem passou por aqui.', scores: { WATER_HEALER: 2, WATER_PLANTBENDER: 1 } },
            { id: 'w3b', text: 'O orvalho nas folhas, os riachos invisíveis. A água está em todo lugar.', scores: { WATER_PLANTBENDER: 3 } },
            { id: 'w3c', text: 'A lua. Sempre a lua.', scores: { WATER_BLOODBENDER: 3 } },
            { id: 'w3d', text: 'O silêncio. A vastidão. Você sente o quanto é pequeno — e isso não te assusta.', scores: { WATER_MASTER: 3 } },
        ],
    },
    {
        id: 'water_q4',
        type: 'choice',
        prompt: 'De qual forma você aprende melhor?',
        options: [
            { id: 'w4a', text: 'Na prática com pessoas — ensinando enquanto aprende.', scores: { WATER_HEALER: 3 } },
            { id: 'w4b', text: 'Na observação profunda de como as coisas se movem e se relacionam.', scores: { WATER_PLANTBENDER: 3 } },
            { id: 'w4c', text: 'Nos limites. Você aprende mais quando é testado ao extremo.', scores: { WATER_BLOODBENDER: 3 } },
            { id: 'w4d', text: 'Pela repetição até a perfeição. Arte antes de especialização.', scores: { WATER_MASTER: 3 } },
        ],
    },
    {
        id: 'water_q5',
        type: 'choice',
        prompt: 'Qual é sua maior força em um grupo?',
        options: [
            { id: 'w5a', text: 'Sei quando alguém está sofrendo antes que diga uma palavra.', scores: { WATER_HEALER: 3 } },
            { id: 'w5b', text: 'Noto padrões e conexões que os outros perdem.', scores: { WATER_PLANTBENDER: 3 } },
            { id: 'w5c', text: 'Mantenho a calma quando tudo desmorona.', scores: { WATER_MASTER: 2, WATER_BLOODBENDER: 1 } },
            { id: 'w5d', text: 'Determino o que precisa ser feito e faço acontecer — com ou sem aprovação.', scores: { WATER_BLOODBENDER: 3 } },
        ],
    },
];

// ═══════════════════════════════════════════════════════
// TERRA — 4 arquétipos:
// EARTH_METALBENDER | EARTH_LAVABENDER | EARTH_SANDBENDER | EARTH_MASTER
// ═══════════════════════════════════════════════════════
export const earthSubQuestions: QuizQuestion[] = [
    {
        id: 'earth_intro',
        type: 'narrative',
        prompt: 'A terra tem memória. Cada estrato carrega uma era. Sob seus pés, séculos de história aguardam quem tenha paciência para ouvi-los.',
    },
    {
        id: 'earth_q1',
        type: 'choice',
        prompt: 'Como você lida com um obstáculo que parece intransponível?',
        options: [
            { id: 'e1a', text: 'Enfrento de frente. Recuar não é opção — é a resistência que me fortalece.', scores: { EARTH_MASTER: 3 } },
            { id: 'e1b', text: 'Procuro o ponto fraco que outros ignoram. Todo sistema tem uma falha.', scores: { EARTH_METALBENDER: 3 } },
            { id: 'e1c', text: 'Adapto minha abordagem até que o caminho apareça. Rigidez é o verdadeiro obstáculo.', scores: { EARTH_SANDBENDER: 3 } },
            { id: 'e1d', text: 'Espero. A pressão certa, no momento certo, dissolve tudo.', scores: { EARTH_LAVABENDER: 3 } },
        ],
    },
    {
        id: 'earth_q2',
        type: 'choice',
        prompt: 'Qual ambiente te faz sentir mais vivo?',
        options: [
            { id: 'e2a', text: 'Uma cidade antiga — cada pedra guarda uma história.', scores: { EARTH_MASTER: 3 } },
            { id: 'e2b', text: 'Uma fábrica ou oficina — onde estruturas são criadas a partir do nada.', scores: { EARTH_METALBENDER: 3 } },
            { id: 'e2c', text: 'Um deserto aberto — vasto, austero, sem pretensões.', scores: { EARTH_SANDBENDER: 3 } },
            { id: 'e2d', text: 'Próximo ao vulcão, ao calor do interior — onde a terra ainda é viva e violenta.', scores: { EARTH_LAVABENDER: 3 } },
        ],
    },
    {
        id: 'earth_q3',
        type: 'choice',
        prompt: 'Em uma discussão intensa, você tende a:',
        options: [
            { id: 'e3a', text: 'Manter sua posição com firmeza — você não muda de ideia por pressão.', scores: { EARTH_MASTER: 3 } },
            { id: 'e3b', text: 'Encontrar a inconsistência no argumento do outro e apontá-la com precisão.', scores: { EARTH_METALBENDER: 3 } },
            { id: 'e3c', text: 'Ceder aqui, avançar ali — você joga o jogo longo.', scores: { EARTH_SANDBENDER: 3 } },
            { id: 'e3d', text: 'Elevar o tom quando a paciência acaba. Você prefere honestidade brutal à diplomacia.', scores: { EARTH_LAVABENDER: 3 } },
        ],
    },
    {
        id: 'earth_q4',
        type: 'choice',
        prompt: 'Como você descreveria sua relação com as regras?',
        options: [
            { id: 'e4a', text: 'As regras existem por uma razão — e eu as respeito até que provem que estão erradas.', scores: { EARTH_MASTER: 3 } },
            { id: 'e4b', text: 'As regras são estruturas. Onde há estrutura, há forma de remodelá-la.', scores: { EARTH_METALBENDER: 3 } },
            { id: 'e4c', text: 'Regras são contextuais. O deserto não tem o mesmo código que a cidade.', scores: { EARTH_SANDBENDER: 3 } },
            { id: 'e4d', text: 'Regras foram feitas antes de mim existir. Por que eu deveria me limitar por elas?', scores: { EARTH_LAVABENDER: 3 } },
        ],
    },
    {
        id: 'earth_q5',
        type: 'choice',
        prompt: 'Que tipo de herança você quer deixar?',
        options: [
            { id: 'e5a', text: 'Algo que dure — uma fundação sólida sobre a qual outros constroem.', scores: { EARTH_MASTER: 3 } },
            { id: 'e5b', text: 'Uma descoberta — algo que muda o que as pessoas acreditam ser possível.', scores: { EARTH_METALBENDER: 3 } },
            { id: 'e5c', text: 'Um caminho traçado em território desconhecido — para que outros possam explorar.', scores: { EARTH_SANDBENDER: 3 } },
            { id: 'e5d', text: 'Uma transformação — o mundo depois de você não é o mesmo que antes.', scores: { EARTH_LAVABENDER: 3 } },
        ],
    },
];

// ═══════════════════════════════════════════════════════
// FOGO — 4 arquétipos:
// FIRE_LIGHTNING | FIRE_COMBUSTION | FIRE_SUN_WARRIOR | FIRE_MASTER
// ═══════════════════════════════════════════════════════
export const fireSubQuestions: QuizQuestion[] = [
    {
        id: 'fire_intro',
        type: 'narrative',
        prompt: 'O fogo não mente. Ele revela tudo — o que alimenta, o que destói, o que aquece. Esta noite, a chama vai te contar quem você realmente é.',
    },
    {
        id: 'fire_q1',
        type: 'choice',
        prompt: 'Como você age decisivamente? Descreva seu estado interno nesse momento.',
        options: [
            { id: 'f1a', text: 'Uma frieza estranha toma conta de mim. Quanto mais sério, mais calmo fico.', scores: { FIRE_LIGHTNING: 3 } },
            { id: 'f1b', text: 'Tudo se estreita em um único ponto de foco. Nada mais existe além do objetivo.', scores: { FIRE_COMBUSTION: 3 } },
            { id: 'f1c', text: 'Sinto uma energia que não é raiva — é algo mais profundo, como propósito.', scores: { FIRE_SUN_WARRIOR: 3 } },
            { id: 'f1d', text: 'Uma força familiar que já conheço bem. Confio nela sem precisar pensar.', scores: { FIRE_MASTER: 3 } },
        ],
    },
    {
        id: 'fire_q2',
        type: 'choice',
        prompt: 'O que é poder, para você?',
        options: [
            { id: 'f2a', text: 'A capacidade de agir no momento exato — nem antes, nem depois.', scores: { FIRE_LIGHTNING: 3 } },
            { id: 'f2b', text: 'A concentração de toda energia em um único propósito irresistível.', scores: { FIRE_COMBUSTION: 3 } },
            { id: 'f2c', text: 'A conexão com algo maior — a chama que vem da vida, não da raiva.', scores: { FIRE_SUN_WARRIOR: 3 } },
            { id: 'f2d', text: 'A maestria — dominar completamente o que você faz, sem depender de truques.', scores: { FIRE_MASTER: 3 } },
        ],
    },
    {
        id: 'fire_q3',
        type: 'choice',
        prompt: 'Qual é a sua relação com a emoção no momento de maior pressão?',
        options: [
            { id: 'f3a', text: 'As emoções saem completamente — como se eu entrasse num estado separado do caos.', scores: { FIRE_LIGHTNING: 3 } },
            { id: 'f3b', text: 'Não sinto o que está ao redor — só o que escolhi alcançar.', scores: { FIRE_COMBUSTION: 3 } },
            { id: 'f3c', text: 'Sinto tudo — mas de um lugar de paz. A intensidade não me consome, me sustenta.', scores: { FIRE_SUN_WARRIOR: 3 } },
            { id: 'f3d', text: 'A pressão me fortalece. Já passei por isso antes — sei o que fazer.', scores: { FIRE_MASTER: 3 } },
        ],
    },
    {
        id: 'fire_q4',
        type: 'choice',
        prompt: 'Qual é o seu maior medo em relação ao seu próprio potencial?',
        options: [
            { id: 'f4a', text: 'Perder o equilíbrio interno e deixar as emoções interferirem no momento errado.', scores: { FIRE_LIGHTNING: 3 } },
            { id: 'f4b', text: 'Que meu foco se disperse antes de alcançar o que almejo.', scores: { FIRE_COMBUSTION: 3 } },
            { id: 'f4c', text: 'Usar minha força de forma errada — para destruir o que deveria proteger.', scores: { FIRE_SUN_WARRIOR: 3 } },
            { id: 'f4d', text: 'Não ter chegado ao meu teto ainda. Há sempre mais a dominar.', scores: { FIRE_MASTER: 3 } },
        ],
    },
    {
        id: 'fire_q5',
        type: 'choice',
        prompt: 'Como você prefere ser visto pelos outros?',
        options: [
            { id: 'f5a', text: 'Imprevisível — ninguém consegue prever quando ou como vou agir.', scores: { FIRE_LIGHTNING: 3 } },
            { id: 'f5b', text: 'Inexorável — quando decido algo, não há força que me desvie.', scores: { FIRE_COMBUSTION: 3 } },
            { id: 'f5c', text: 'Íntegro — que minha força venha de um lugar que todos possam respeitar.', scores: { FIRE_SUN_WARRIOR: 3 } },
            { id: 'f5d', text: 'Competente — alguém em quem se pode confiar quando as coisas ficam sérias.', scores: { FIRE_MASTER: 3 } },
        ],
    },
];

// ═══════════════════════════════════════════════════════
// AR — 4 arquétipos:
// AIR_FLIGHT | AIR_SPIRITUAL | AIR_NOMAD | AIR_MASTER
// ═══════════════════════════════════════════════════════
export const airSubQuestions: QuizQuestion[] = [
    {
        id: 'air_intro',
        type: 'narrative',
        prompt: 'O ar não tem forma — mas molda tudo. Ele carrega sementes, vozes, cheiros de lugares distantes. E esta noite, ele traz uma pergunta que só você pode responder.',
    },
    {
        id: 'air_q1',
        type: 'choice',
        prompt: 'Quando você está no seu estado mais pleno, você sente:',
        options: [
            { id: 'a1a', text: 'Uma leveza que parece desafiar o peso do mundo.', scores: { AIR_FLIGHT: 3 } },
            { id: 'a1b', text: 'Uma presença além do seu corpo — como se você existisse em camadas.', scores: { AIR_SPIRITUAL: 3 } },
            { id: 'a1c', text: 'Uma paz que não depende de nada ao redor.', scores: { AIR_NOMAD: 3 } },
            { id: 'a1d', text: 'Uma clareza total — cada movimento flui do próximo sem esforço.', scores: { AIR_MASTER: 3 } },
        ],
    },
    {
        id: 'air_q2',
        type: 'choice',
        prompt: 'O que significa "liberdade" para você, de verdade?',
        options: [
            { id: 'a2a', text: 'Não ser contido por nada — nem por lugar, nem por crença, nem por medo.', scores: { AIR_FLIGHT: 3 } },
            { id: 'a2b', text: 'Poder ir além do que os olhos alcançam — explorar o que outros não podem.', scores: { AIR_SPIRITUAL: 3 } },
            { id: 'a2c', text: 'Não pertencer — e estar em paz com isso.', scores: { AIR_NOMAD: 3 } },
            { id: 'a2d', text: 'Dominar a arte a ponto de não precisar pensar — só fluir.', scores: { AIR_MASTER: 3 } },
        ],
    },
    {
        id: 'air_q3',
        type: 'choice',
        prompt: 'Qual é sua relação com o apego?',
        options: [
            { id: 'a3a', text: 'Sinto que o apego me pesa. Quanto menos carrego, mais longe chego.', scores: { AIR_FLIGHT: 3, AIR_NOMAD: 1 } },
            { id: 'a3b', text: 'Me apego ao invisível — a sentidos, intuições, conexões que não vejo mas sinto.', scores: { AIR_SPIRITUAL: 3 } },
            { id: 'a3c', text: 'Aprendi a soltar. Cada perda me ensinou algo sobre o que realmente importa.', scores: { AIR_NOMAD: 3 } },
            { id: 'a3d', text: 'Me apego à prática. O aperfeiçoamento contínuo é o único vínculo que vale.', scores: { AIR_MASTER: 3 } },
        ],
    },
    {
        id: 'air_q4',
        type: 'choice',
        prompt: 'Em um momento de silêncio profundo, sua mente vai para:',
        options: [
            { id: 'a4a', text: 'A sensação de estar acima de tudo — altura, perspectiva, distância.', scores: { AIR_FLIGHT: 3 } },
            { id: 'a4b', text: 'Lugares que nunca visitei, vozes de quem não está presente, algo que vai além.', scores: { AIR_SPIRITUAL: 3 } },
            { id: 'a4c', text: 'O vazio. E no vazio, uma presença tranquila que é só sua.', scores: { AIR_NOMAD: 3 } },
            { id: 'a4d', text: 'Um movimento, uma sequência, algo que ainda pode ser refinado.', scores: { AIR_MASTER: 3 } },
        ],
    },
    {
        id: 'air_q5',
        type: 'choice',
        prompt: 'O que você diria que é seu maior dom?',
        options: [
            { id: 'a5a', text: 'Ir onde outros não conseguem chegar — fisicamente ou mentalmente.', scores: { AIR_FLIGHT: 3 } },
            { id: 'a5b', text: 'Perceber o que está além do que os outros conseguem ver ou sentir.', scores: { AIR_SPIRITUAL: 3 } },
            { id: 'a5c', text: 'Encontrar paz em qualquer situação — e transmiti-la aos que estão ao redor.', scores: { AIR_NOMAD: 3 } },
            { id: 'a5d', text: 'A consistência. Eu me apresento completo, sempre — em qualquer circunstância.', scores: { AIR_MASTER: 3 } },
        ],
    },
];

// ═══════════════════════════════════════════════════════
// NÃO-DOBRADOR — 4 arquétipos:
// NON_BENDER_LEADER | NON_BENDER_KYOSHI | NON_BENDER_CHI_BLOCKER | NON_BENDER_ENGINEER
// ═══════════════════════════════════════════════════════
export const nonBenderSubQuestions: QuizQuestion[] = [
    {
        id: 'non_intro',
        type: 'narrative',
        prompt: 'A história está cheia de nomes que mudaram o mundo sem jamais realizar uma única dobra. Agora é a sua vez de descobrir qual desses caminhos é o seu.',
    },
    {
        id: 'non_q1',
        type: 'choice',
        prompt: 'Em uma situação caótica, o que você faz primeiro?',
        options: [
            { id: 'n1a', text: 'Avalio quem está onde e o que cada um pode fazer. Delego com precisão.', scores: { NON_BENDER_LEADER: 3 } },
            { id: 'n1b', text: 'Protejo os que estão próximos. Ação antes de reflexão.', scores: { NON_BENDER_KYOSHI: 3 } },
            { id: 'n1c', text: 'Neutralizo a maior ameaça imediata. Uma boa intervenção muda tudo.', scores: { NON_BENDER_CHI_BLOCKER: 3 } },
            { id: 'n1d', text: 'Identifico o problema raiz. Soluções rápidas criam problemas maiores depois.', scores: { NON_BENDER_ENGINEER: 3 } },
        ],
    },
    {
        id: 'non_q2',
        type: 'choice',
        prompt: 'Como você prefere preparar uma missão difícil?',
        options: [
            { id: 'n2a', text: 'Mapeando antecipadamente o que pode dar errado — e criando contingências.', scores: { NON_BENDER_LEADER: 3 } },
            { id: 'n2b', text: 'Treinando até os movimentos serem automáticos. O corpo tem que saber o que fazer.', scores: { NON_BENDER_KYOSHI: 3 } },
            { id: 'n2c', text: 'Estudando o adversário — onde ele é forte, onde ele é frágil.', scores: { NON_BENDER_CHI_BLOCKER: 3 } },
            { id: 'n2d', text: 'Construindo ou adaptando algo que nivele o campo. A vantagem certa muda tudo.', scores: { NON_BENDER_ENGINEER: 3 } },
        ],
    },
    {
        id: 'non_q3',
        type: 'choice',
        prompt: 'O que move você quando as coisas ficam difíceis?',
        options: [
            { id: 'n3a', text: 'O grupo. Não posso falhar com as pessoas que dependem de mim.', scores: { NON_BENDER_LEADER: 3 } },
            { id: 'n3b', text: 'A responsabilidade. Escolhi defender — isso não muda em função da dificuldade.', scores: { NON_BENDER_KYOSHI: 3 } },
            { id: 'n3c', text: 'A injustiça. Quando o sistema favorece um lado sem mérito, preciso agir.', scores: { NON_BENDER_CHI_BLOCKER: 3 } },
            { id: 'n3d', text: 'O problema em si. Quanto mais complexo, mais quero resolvê-lo.', scores: { NON_BENDER_ENGINEER: 3 } },
        ],
    },
    {
        id: 'non_q4',
        type: 'choice',
        prompt: 'Como os outros costumam te descrever?',
        options: [
            { id: 'n4a', text: 'Alguém que sabe o que fazer quando ninguém mais sabe.', scores: { NON_BENDER_LEADER: 3 } },
            { id: 'n4b', text: 'Alguém que você quer do seu lado — e não quer como inimigo.', scores: { NON_BENDER_KYOSHI: 3 } },
            { id: 'n4c', text: 'Observador, discreto — até que deixa de ser.', scores: { NON_BENDER_CHI_BLOCKER: 3 } },
            { id: 'n4d', text: 'Aquele que resolve o que os outros desistiram de tentar.', scores: { NON_BENDER_ENGINEER: 3 } },
        ],
    },
    {
        id: 'non_q5',
        type: 'choice',
        prompt: 'Qual legado você quer deixar?',
        options: [
            { id: 'n5a', text: 'Um grupo de pessoas que aprendeu a trabalhar junto — e que continua sem mim.', scores: { NON_BENDER_LEADER: 3 } },
            { id: 'n5b', text: 'Uma tradição. Valores que sobrevivem porque foram ensinados com rigor e amor.', scores: { NON_BENDER_KYOSHI: 3 } },
            { id: 'n5c', text: 'Um equilíbrio restaurado — que eu dei minha parte para que o mundo fosse mais justo.', scores: { NON_BENDER_CHI_BLOCKER: 3 } },
            { id: 'n5d', text: 'Uma invenção. Algo que continua funcionando mesmo depois que eu não estou mais aqui.', scores: { NON_BENDER_ENGINEER: 3 } },
        ],
    },
];

// ═══════════════════════════════════════════════════════
// Mapa de elemento → perguntas
// ═══════════════════════════════════════════════════════
export const subbendingQuestionsMap: Record<string, QuizQuestion[]> = {
    water: waterSubQuestions,
    earth: earthSubQuestions,
    fire: fireSubQuestions,
    air: airSubQuestions,
    none: nonBenderSubQuestions,
};
