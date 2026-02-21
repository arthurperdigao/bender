/**
 * src/lib/types/triviaQuestions.ts
 *
 * Banco COMPLETO de perguntas de trivia do universo Avatar.
 * Cobre: ATLA, LOK, Mundo Espiritual, Dobras, Sub-dobras, Lore profundo.
 * 48 perguntas: 16 fácil + 16 médio + 16 difícil
 */
import { TriviaQuestion } from './trivia';

export const allTriviaQuestions: TriviaQuestion[] = [

  // ═══════════════════════════════════════════
  // FÁCIL — Qualquer pessoa que assistiu sabe
  // ═══════════════════════════════════════════
  {
    question: 'Qual é o nome do bisão voador de Aang?',
    options: ['Momo', 'Appa', 'Oogi', 'Naga'],
    correctAnswerIndex: 1, difficulty: 'easy',
  },
  {
    question: 'Quantos elementos existem no mundo de Avatar?',
    options: ['3', '4', '5', '6'],
    correctAnswerIndex: 1, difficulty: 'easy',
  },
  {
    question: 'Qual nação iniciou a Guerra dos Cem Anos?',
    options: ['Reino da Terra', 'Nação do Fogo', 'Tribo da Água', 'Nômades do Ar'],
    correctAnswerIndex: 1, difficulty: 'easy',
  },
  {
    question: 'Quem é o pai de Zuko?',
    options: ['Iroh', 'Ozai', 'Roku', 'Sozin'],
    correctAnswerIndex: 1, difficulty: 'easy',
  },
  {
    question: 'Toph Beifong é dobradora de qual elemento?',
    options: ['Água', 'Fogo', 'Terra', 'Ar'],
    correctAnswerIndex: 2, difficulty: 'easy',
  },
  {
    question: 'Qual é o nome do tio de Zuko?',
    options: ['Ozai', 'Zhao', 'Iroh', 'Bumi'],
    correctAnswerIndex: 2, difficulty: 'easy',
  },
  {
    question: 'Aang foi congelado em gelo por quantos anos?',
    options: ['50', '100', '200', '500'],
    correctAnswerIndex: 1, difficulty: 'easy',
  },
  {
    question: 'Qual é o nome da irmã de Zuko?',
    options: ['Mai', 'Ty Lee', 'Azula', 'Suki'],
    correctAnswerIndex: 2, difficulty: 'easy',
  },
  {
    question: 'Sokka é um dobrador?',
    options: ['Sim, de Água', 'Sim, de Terra', 'Não, é um guerreiro', 'Sim, de Espada'],
    correctAnswerIndex: 2, difficulty: 'easy',
  },
  {
    question: 'Em qual cidade fica o Rei da Terra?',
    options: ['Omashu', 'Ba Sing Se', 'Zaofu', 'Kyoshi'],
    correctAnswerIndex: 1, difficulty: 'easy',
  },
  {
    question: 'Qual animal de estimação acompanha Aang além de Appa?',
    options: ['Um lemure chamado Momo', 'Um falcão', 'Um dragão', 'Um peixe-koi'],
    correctAnswerIndex: 0, difficulty: 'easy',
  },
  {
    question: 'Quem é a Avatar depois de Aang?',
    options: ['Kyoshi', 'Roku', 'Korra', 'Yangchen'],
    correctAnswerIndex: 2, difficulty: 'easy',
  },
  {
    question: 'De que tribo Katara e Sokka são originários?',
    options: ['Tribo da Água do Norte', 'Tribo da Água do Sul', 'Pântano Nebuloso', 'Tribo da Água do Leste'],
    correctAnswerIndex: 1, difficulty: 'easy',
  },
  {
    question: 'Qual cor é a chama de Azula?',
    options: ['Vermelha', 'Laranja', 'Azul', 'Branca'],
    correctAnswerIndex: 2, difficulty: 'easy',
  },
  {
    question: 'O que o Cometa de Sozin faz com os dobradores de fogo?',
    options: ['Nada', 'Enfraquece-os', 'Aumenta drasticamente seu poder', 'Transforma-os em dragões'],
    correctAnswerIndex: 2, difficulty: 'easy',
  },
  {
    question: 'Como se chama o esporte de dobra em equipe na era de Korra?',
    options: ['Agni Kai', 'Pro-Bending', 'Dia do Avatar', 'Torneio dos Elementos'],
    correctAnswerIndex: 1, difficulty: 'easy',
  },

  // ═══════════════════════════════════════════
  // MÉDIO — Para fãs que prestaram atenção
  // ═══════════════════════════════════════════
  {
    question: 'Quem ensinou Aang a dobrar fogo?',
    options: ['Iroh', 'Zuko', 'Jeong Jeong', 'Ran & Shaw'],
    correctAnswerIndex: 1, difficulty: 'medium',
  },
  {
    question: 'Qual é o nome da princesa que se tornou o Espírito da Lua?',
    options: ['Katara', 'Yue', 'Suki', 'Azula'],
    correctAnswerIndex: 1, difficulty: 'medium',
  },
  {
    question: 'Qual ordem secreta Iroh pertence?',
    options: ['Dai Li', 'Lótus Branco', 'Rough Rhinos', 'Red Lotus'],
    correctAnswerIndex: 1, difficulty: 'medium',
  },
  {
    question: 'Quem inventou a Dobra de Metal?',
    options: ['Bumi', 'Toph Beifong', 'Suyin Beifong', 'Lin Beifong'],
    correctAnswerIndex: 1, difficulty: 'medium',
  },
  {
    question: 'Onde fica a biblioteca de Wan Shi Tong?',
    options: ['Ba Sing Se', 'No deserto de Si Wong', 'No Mundo Espiritual', 'Na Nação do Fogo'],
    correctAnswerIndex: 1, difficulty: 'medium',
  },
  {
    question: 'Qual Avatar viveu imediatamente antes de Aang?',
    options: ['Kyoshi', 'Roku', 'Kuruk', 'Yangchen'],
    correctAnswerIndex: 1, difficulty: 'medium',
  },
  {
    question: 'Qual é o verdadeiro nome da organização secreta que controla Ba Sing Se?',
    options: ['Lótus Branco', 'Dai Li', 'A Ordem', 'Sentinelas'],
    correctAnswerIndex: 1, difficulty: 'medium',
  },
  {
    question: 'Quem derrotou Azula no final da série?',
    options: ['Aang', 'Zuko', 'Katara', 'Iroh'],
    correctAnswerIndex: 2, difficulty: 'medium',
  },
  {
    question: 'O que Ty Lee faz quando acerta pontos de pressão no corpo?',
    options: ['Cura a pessoa', 'Bloqueia o chi (dobra)', 'Causa paralisia permanente', 'Aumenta a dobra'],
    correctAnswerIndex: 1, difficulty: 'medium',
  },
  {
    question: 'Qual evento cósmico acontece a cada 10.000 anos no universo Avatar?',
    options: ['Eclipse Solar', 'Cometa de Sozin', 'Convergência Harmônica', 'Noite de Yue'],
    correctAnswerIndex: 2, difficulty: 'medium',
  },
  {
    question: 'Quem é o líder dos Igualitários em A Lenda de Korra?',
    options: ['Zaheer', 'Amon', 'Unalaq', 'Kuvira'],
    correctAnswerIndex: 1, difficulty: 'medium',
  },
  {
    question: 'Qual sub-dobra Bolin é capaz de usar?',
    options: ['Dobra de Metal', 'Dobra de Lava', 'Dobra de Areia', 'Dobra de Sangue'],
    correctAnswerIndex: 1, difficulty: 'medium',
  },
  {
    question: 'Qual animal ensinou os humanos a dobrar terra originalmente?',
    options: ['Dragões', 'Bisões celestes', 'Texugos-toupeira', 'Tartarugas-leão'],
    correctAnswerIndex: 2, difficulty: 'medium',
  },
  {
    question: 'Suki é líder de qual grupo de guerreiras?',
    options: ['Guerreiras de Kyoshi', 'Guerreiras de Ba Sing Se', 'Filhas de Ozai', 'Valquírias do Norte'],
    correctAnswerIndex: 0, difficulty: 'medium',
  },
  {
    question: 'Qual é a bebida favorita de Iroh?',
    options: ['Saquê', 'Café', 'Chá', 'Suco de cacto'],
    correctAnswerIndex: 2, difficulty: 'medium',
  },
  {
    question: 'Qual arma Sokka forjou a partir de um meteorito?',
    options: ['Um bumerangue', 'Uma espada', 'Um machado', 'Um escudo'],
    correctAnswerIndex: 1, difficulty: 'medium',
  },

  // ═══════════════════════════════════════════
  // DIFÍCIL — Só mestres do lore acertam tudo
  // ═══════════════════════════════════════════
  {
    question: 'Qual é o nome do primeiro Avatar da história?',
    options: ['Raava', 'Wan', 'Vaatu', 'Yangchen'],
    correctAnswerIndex: 1, difficulty: 'hard',
  },
  {
    question: 'Qual técnica de dobra de fogo requer "separar as energias"?',
    options: ['Combustão', 'Relâmpago', 'Chama Azul', 'Explosão Solar'],
    correctAnswerIndex: 1, difficulty: 'hard',
  },
  {
    question: 'Quem liderou o genocídio dos Nômades do Ar?',
    options: ['Ozai', 'Azulon', 'Sozin', 'Zhao'],
    correctAnswerIndex: 2, difficulty: 'hard',
  },
  {
    question: 'Qual é o nome da mãe de Zuko?',
    options: ['Mai', 'Ursa', 'Azula', 'Lo'],
    correctAnswerIndex: 1, difficulty: 'hard',
  },
  {
    question: 'Qual espírito rouba rostos e vive no Mundo Espiritual?',
    options: ['Wan Shi Tong', 'Koh, o Ladrão de Rostos', 'Hei Bai', 'Vaatu'],
    correctAnswerIndex: 1, difficulty: 'hard',
  },
  {
    question: 'Como Amon conseguia tirar a dobra das pessoas em Korra?',
    options: ['Dobra de Energia', 'Dobra de Sangue avançada', 'Tecnologia Igualitária', 'Poder espiritual de Vaatu'],
    correctAnswerIndex: 1, difficulty: 'hard',
  },
  {
    question: 'Qual membro do Red Lotus alcançou o voo sem peso?',
    options: ['Ghazan', 'Ming-Hua', 'Zaheer', "P'Li"],
    correctAnswerIndex: 2, difficulty: 'hard',
  },
  {
    question: 'Qual é o nome da cidade de metal fundada pela filha de Toph?',
    options: ['Cidade da República', 'Zaofu', 'Omashu', 'Yu Dao'],
    correctAnswerIndex: 1, difficulty: 'hard',
  },
  {
    question: 'O que Sokka usa para derrotar Combustion Man?',
    options: ['Sua espada de meteorito', 'Seu bumerangue', 'Uma armadilha', 'Dobra de Água emprestada'],
    correctAnswerIndex: 1, difficulty: 'hard',
  },
  {
    question: 'Em que Livro/Temporada Zuko se junta oficialmente ao Gaang?',
    options: ['Livro 1: Água', 'Livro 2: Terra', 'Livro 3: Fogo', 'Livro 4: Ar'],
    correctAnswerIndex: 2, difficulty: 'hard',
  },
  {
    question: 'Qual chakra é bloqueado pelo medo e está localizado no estômago?',
    options: ['Chakra da Água', 'Chakra do Fogo', 'Chakra da Terra', 'Chakra do Som'],
    correctAnswerIndex: 0, difficulty: 'hard',
  },
  {
    question: 'Quem ensinou Katara a dominar a Dobra de Sangue?',
    options: ['Pakku', 'Hama', 'Yugoda', 'Kya'],
    correctAnswerIndex: 1, difficulty: 'hard',
  },
  {
    question: 'Qual é o nome dos dois dragões que ensinam o verdadeiro significado do fogo?',
    options: ['Druk e Fang', 'Ran e Shaw', 'Agni e Kai', 'Roku e Sozin'],
    correctAnswerIndex: 1, difficulty: 'hard',
  },
  {
    question: 'O Rei Bumi de Omashu é dobrador de terra. Qual é sua peculiaridade como guerreiro?',
    options: ['Ele é o mais jovem mestre', 'Ele luta com os olhos fechados', 'Ele é o rei mais velho e louco de Omashu', 'Ele é um não-dobrador disfarçado'],
    correctAnswerIndex: 2, difficulty: 'hard',
  },
  {
    question: 'Kuvira, a vilã do Livro 4 de Korra, construiu uma arma usando o quê?',
    options: ['Energia espiritual das videiras', 'Fragmentos do Cometa de Sozin', 'Metal de Zaofu', 'Chi dos dobradores capturados'],
    correctAnswerIndex: 0, difficulty: 'hard',
  },
  {
    question: 'Qual é o nome do nômade do ar que disse "Solte suas ligações terrenas, entre no vazio"?',
    options: ['Monge Gyatso', 'Guru Pathik', 'Guru Laghima', 'Tenzin'],
    correctAnswerIndex: 2, difficulty: 'hard',
  },
];