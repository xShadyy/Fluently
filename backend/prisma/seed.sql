--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-04-18 21:34:25

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4928 (class 0 OID 30581)
-- Dependencies: 220
-- Data for Name: Game; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public."Game" (id, name, type) VALUES ('game-wordquiz', 'Wordquiz', 'WORDS');
INSERT INTO public."Game" (id, name, type) VALUES ('game-proficiency', 'Proficiencyquiz', 'ENGLISH_GRAMMAR_TEST');


--
-- TOC entry 4929 (class 0 OID 30589)
-- Dependencies: 221
-- Data for Name: Question; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public."Question" (id, text, "gameId") VALUES ('pq_1', 'Choose the correct form: ''He ___ to the store yesterday.''', 'game-proficiency');
INSERT INTO public."Question" (id, text, "gameId") VALUES ('pq_2', 'Select the grammatically correct sentence.', 'game-proficiency');
INSERT INTO public."Question" (id, text, "gameId") VALUES ('pq_3', 'Fill in the blank: ''I have been living here ___ 2010.''', 'game-proficiency');
INSERT INTO public."Question" (id, text, "gameId") VALUES ('pq_4', 'Which sentence is in the passive voice?', 'game-proficiency');
INSERT INTO public."Question" (id, text, "gameId") VALUES ('pq_5', 'Choose the correct comparative form: ''This car is ___ than that one.''', 'game-proficiency');
INSERT INTO public."Question" (id, text, "gameId") VALUES ('pq_6', 'Choose the correct article: ''I saw ___ elephant at the zoo.''', 'game-proficiency');
INSERT INTO public."Question" (id, text, "gameId") VALUES ('pq_7', 'Choose the correct preposition: ''He is interested ___ learning languages.''', 'game-proficiency');
INSERT INTO public."Question" (id, text, "gameId") VALUES ('pq_8', 'Fill in the blank: ''They have ___ finished their homework.''', 'game-proficiency');
INSERT INTO public."Question" (id, text, "gameId") VALUES ('pq_9', 'Which sentence is in the present perfect continuous tense?', 'game-proficiency');
INSERT INTO public."Question" (id, text, "gameId") VALUES ('pq_10', 'Select the correct modal verb: ''You ___ see a doctor if the pain continues.''', 'game-proficiency');


--
-- TOC entry 4930 (class 0 OID 30596)
-- Dependencies: 222
-- Data for Name: Option; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_1_opt_1', 'go', 'pq_1');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_1_opt_2', 'went', 'pq_1');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_1_opt_3', 'gone', 'pq_1');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_1_opt_4', 'goes', 'pq_1');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_2_opt_1', 'She don''t like apples.', 'pq_2');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_2_opt_2', 'She doesn''t like apples.', 'pq_2');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_2_opt_3', 'She not like apples.', 'pq_2');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_2_opt_4', 'She no likes apples.', 'pq_2');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_3_opt_1', 'since', 'pq_3');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_3_opt_2', 'for', 'pq_3');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_3_opt_3', 'at', 'pq_3');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_3_opt_4', 'by', 'pq_3');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_4_opt_1', 'The cake was eaten by the children.', 'pq_4');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_4_opt_2', 'The children eat cake.', 'pq_4');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_4_opt_3', 'They will eat cake.', 'pq_4');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_4_opt_4', 'She baked a cake.', 'pq_4');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_5_opt_1', 'more fast', 'pq_5');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_5_opt_2', 'faster', 'pq_5');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_5_opt_3', 'fastest', 'pq_5');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_5_opt_4', 'more faster', 'pq_5');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_6_opt_1', 'an', 'pq_6');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_6_opt_2', 'a', 'pq_6');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_6_opt_3', 'the', 'pq_6');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_6_opt_4', 'no article', 'pq_6');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_7_opt_1', 'in', 'pq_7');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_7_opt_2', 'on', 'pq_7');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_7_opt_3', 'at', 'pq_7');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_7_opt_4', 'for', 'pq_7');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_8_opt_1', 'already', 'pq_8');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_8_opt_2', 'yet', 'pq_8');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_8_opt_3', 'still', 'pq_8');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_8_opt_4', 'ever', 'pq_8');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_9_opt_1', 'He has been running since morning.', 'pq_9');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_9_opt_2', 'He runs every day.', 'pq_9');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_9_opt_3', 'He is running now.', 'pq_9');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_9_opt_4', 'He ran yesterday.', 'pq_9');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_10_opt_1', 'should', 'pq_10');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_10_opt_2', 'must', 'pq_10');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_10_opt_3', 'could', 'pq_10');
INSERT INTO public."Option" (id, text, "questionId") VALUES ('pq_10_opt_4', 'might', 'pq_10');


--
-- TOC entry 4931 (class 0 OID 30603)
-- Dependencies: 223
-- Data for Name: CorrectAnswer; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public."CorrectAnswer" (id, "questionId", "optionId") VALUES ('pq_1_ca', 'pq_1', 'pq_1_opt_2');
INSERT INTO public."CorrectAnswer" (id, "questionId", "optionId") VALUES ('pq_2_ca', 'pq_2', 'pq_2_opt_2');
INSERT INTO public."CorrectAnswer" (id, "questionId", "optionId") VALUES ('pq_3_ca', 'pq_3', 'pq_3_opt_1');
INSERT INTO public."CorrectAnswer" (id, "questionId", "optionId") VALUES ('pq_4_ca', 'pq_4', 'pq_4_opt_1');
INSERT INTO public."CorrectAnswer" (id, "questionId", "optionId") VALUES ('pq_5_ca', 'pq_5', 'pq_5_opt_2');
INSERT INTO public."CorrectAnswer" (id, "questionId", "optionId") VALUES ('pq_6_ca', 'pq_6', 'pq_6_opt_1');
INSERT INTO public."CorrectAnswer" (id, "questionId", "optionId") VALUES ('pq_7_ca', 'pq_7', 'pq_7_opt_1');
INSERT INTO public."CorrectAnswer" (id, "questionId", "optionId") VALUES ('pq_8_ca', 'pq_8', 'pq_8_opt_1');
INSERT INTO public."CorrectAnswer" (id, "questionId", "optionId") VALUES ('pq_9_ca', 'pq_9', 'pq_9_opt_1');
INSERT INTO public."CorrectAnswer" (id, "questionId", "optionId") VALUES ('pq_10_ca', 'pq_10', 'pq_10_opt_1');


--
-- TOC entry 4926 (class 0 OID 30565)
-- Dependencies: 218
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public."User" (id, username, email, password, "createdAt", "hasCompletedProficiencyQuiz") VALUES ('2a54b42a-721d-455a-a042-ba14c4cbb4aa', 'CoolGuy123', 'test@gmail.com', '$2b$10$0xy4.EqJpw9wvK4pzFL9leSS31hG8002LPel99jS2yUEh8OC6iAWK', '2025-03-15 12:00:49.082', false);


--
-- TOC entry 4935 (class 0 OID 34804)
-- Dependencies: 227
-- Data for Name: QuizCompletion; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- TOC entry 4927 (class 0 OID 30573)
-- Dependencies: 219
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public."Session" (id, "userId", "createdAt", "expiresAt") VALUES ('7d98c33e-3499-4e58-afe6-bfb3b763dc37', '2a54b42a-721d-455a-a042-ba14c4cbb4aa', '2025-03-15 12:00:55.274', '2025-05-16 14:43:36.834');


--
-- TOC entry 4932 (class 0 OID 30610)
-- Dependencies: 224
-- Data for Name: WordsQuestion; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('b_q1', 'Jak przetłumaczymy słowo: "kot"?', 'BEGINNER', 'game-wordquiz');
INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('b_q2', 'Jak przetłumaczymy słowo: "pies"?', 'BEGINNER', 'game-wordquiz');
INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('b_q3', 'Jak przetłumaczymy słowo: "dom"?', 'BEGINNER', 'game-wordquiz');
INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('b_q4', 'Jak przetłumaczymy słowo: "książka"?', 'BEGINNER', 'game-wordquiz');
INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('b_q5', 'Jak przetłumaczymy słowo: "jabłko"?', 'BEGINNER', 'game-wordquiz');
INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('b_q6', 'Jak przetłumaczymy słowo: "woda"?', 'BEGINNER', 'game-wordquiz');
INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('b_q7', 'Jak przetłumaczymy słowo: "drzewo"?', 'BEGINNER', 'game-wordquiz');
INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('b_q8', 'Jak przetłumaczymy słowo: "słońce"?', 'BEGINNER', 'game-wordquiz');
INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('b_q9', 'Jak przetłumaczymy słowo: "księżyc"?', 'BEGINNER', 'game-wordquiz');
INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('b_q10', 'Jak przetłumaczymy słowo: "samochód"?', 'BEGINNER', 'game-wordquiz');
INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('i_q1', 'What is the correct translation of "meticulous"?', 'INTERMEDIATE', 'game-wordquiz');
INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('i_q2', 'What is the correct translation of "candid"?', 'INTERMEDIATE', 'game-wordquiz');
INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('i_q3', 'What is the correct translation of "intricate"?', 'INTERMEDIATE', 'game-wordquiz');
INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('i_q4', 'What is the correct translation of "vivid"?', 'INTERMEDIATE', 'game-wordquiz');
INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('i_q10', 'What is the correct translation of "diligent"?', 'INTERMEDIATE', 'game-wordquiz');
INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('i_q11', 'What is the correct translation of "innovative"?', 'INTERMEDIATE', 'game-wordquiz');
INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('i_q12', 'What is the correct translation of "robust"?', 'INTERMEDIATE', 'game-wordquiz');
INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('i_q13', 'What is the correct translation of "lucid"?', 'INTERMEDIATE', 'game-wordquiz');
INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('i_q14', 'What is the correct translation of "whimsical"?', 'INTERMEDIATE', 'game-wordquiz');
INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('i_q15', 'What is the correct translation of "intrepid"?', 'INTERMEDIATE', 'game-wordquiz');
INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('a_q1', 'What is the correct translation of "ephemeral"?', 'ADVANCED', 'game-wordquiz');
INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('a_q10', 'What is the correct translation of "perfunctory"?', 'ADVANCED', 'game-wordquiz');
INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('a_q11', 'What is the correct translation of "obstinate"?', 'ADVANCED', 'game-wordquiz');
INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('a_q12', 'What is the correct translation of "capricious"?', 'ADVANCED', 'game-wordquiz');
INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('a_q13', 'What is the correct translation of "ubiquitous"?', 'ADVANCED', 'game-wordquiz');
INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('a_q14', 'What is the correct translation of "acrimony"?', 'ADVANCED', 'game-wordquiz');
INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('a_q15', 'What is the correct translation of "pulchritudinous"?', 'ADVANCED', 'game-wordquiz');
INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('a_q16', 'What is the correct translation of "intransigent"?', 'ADVANCED', 'game-wordquiz');
INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('a_q17', 'What is the correct translation of "recalcitrant"?', 'ADVANCED', 'game-wordquiz');
INSERT INTO public."WordsQuestion" (id, text, difficulty, "gameId") VALUES ('a_q18', 'What is the correct translation of "perspicacious"?', 'ADVANCED', 'game-wordquiz');


--
-- TOC entry 4933 (class 0 OID 30617)
-- Dependencies: 225
-- Data for Name: WordsOption; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q1_o1', 'cat', 'b_q1');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q1_o2', 'dog', 'b_q1');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q1_o3', 'fish', 'b_q1');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q1_o4', 'bird', 'b_q1');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q2_o1', 'dog', 'b_q2');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q2_o2', 'cat', 'b_q2');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q2_o3', 'mouse', 'b_q2');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q2_o4', 'rabbit', 'b_q2');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q3_o1', 'house', 'b_q3');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q3_o2', 'car', 'b_q3');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q3_o3', 'tree', 'b_q3');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q3_o4', 'flower', 'b_q3');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q4_o1', 'book', 'b_q4');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q4_o2', 'pen', 'b_q4');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q4_o3', 'paper', 'b_q4');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q4_o4', 'computer', 'b_q4');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q5_o1', 'apple', 'b_q5');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q5_o2', 'orange', 'b_q5');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q5_o3', 'banana', 'b_q5');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q5_o4', 'grape', 'b_q5');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q6_o1', 'water', 'b_q6');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q6_o2', 'milk', 'b_q6');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q6_o3', 'juice', 'b_q6');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q6_o4', 'coffee', 'b_q6');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q7_o1', 'tree', 'b_q7');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q7_o2', 'bush', 'b_q7');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q7_o3', 'grass', 'b_q7');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q7_o4', 'flower', 'b_q7');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q8_o1', 'sun', 'b_q8');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q8_o2', 'moon', 'b_q8');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q8_o3', 'star', 'b_q8');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q8_o4', 'cloud', 'b_q8');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q9_o1', 'moon', 'b_q9');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q9_o2', 'sun', 'b_q9');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q9_o3', 'planet', 'b_q9');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q9_o4', 'comet', 'b_q9');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q10_o1', 'car', 'b_q10');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q10_o2', 'bicycle', 'b_q10');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q10_o3', 'train', 'b_q10');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('b_q10_o4', 'plane', 'b_q10');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q1_o1', 'skrupulatny', 'i_q1');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q1_o2', 'nierozważny', 'i_q1');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q1_o3', 'spontaniczny', 'i_q1');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q1_o4', 'niechlujny', 'i_q1');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q2_o1', 'szczery', 'i_q2');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q2_o2', 'ukryty', 'i_q2');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q2_o3', 'przebiegły', 'i_q2');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q2_o4', 'przesadny', 'i_q2');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q3_o1', 'zawiły', 'i_q3');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q3_o2', 'prosty', 'i_q3');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q3_o3', 'łatwy', 'i_q3');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q3_o4', 'bezpośredni', 'i_q3');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q4_o1', 'intensywny', 'i_q4');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q4_o2', 'przytłumiony', 'i_q4');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q4_o3', 'matowy', 'i_q4');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q4_o4', 'blady', 'i_q4');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q10_o1', 'sumienny', 'i_q10');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q10_o2', 'leniwy', 'i_q10');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q10_o3', 'nieostrożny', 'i_q10');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q10_o4', 'niezdecydowany', 'i_q10');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q11_o1', 'innowacyjny', 'i_q11');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q11_o2', 'tradycyjny', 'i_q11');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q11_o3', 'konwencjonalny', 'i_q11');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q11_o4', 'kopiujący', 'i_q11');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q12_o1', 'solidny', 'i_q12');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q12_o2', 'kruchy', 'i_q12');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q12_o3', 'delikatny', 'i_q12');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q12_o4', 'słaby', 'i_q12');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q13_o1', 'jasny', 'i_q13');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q13_o2', 'mroczny', 'i_q13');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q13_o3', 'zamglony', 'i_q13');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q13_o4', 'ciemny', 'i_q13');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q14_o1', 'kapryśny', 'i_q14');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q14_o2', 'poważny', 'i_q14');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q14_o3', 'konwencjonalny', 'i_q14');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q14_o4', 'stereotypowy', 'i_q14');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q15_o1', 'nieustraszony', 'i_q15');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q15_o2', 'tchórzliwy', 'i_q15');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q15_o3', 'ostrożny', 'i_q15');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('i_q15_o4', 'niepewny', 'i_q15');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q1_o1', 'permanent', 'a_q1');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q1_o2', 'short-lived', 'a_q1');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q1_o3', 'translucent', 'a_q1');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q1_o4', 'rapid', 'a_q1');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q10_o1', 'careful', 'a_q10');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q10_o2', 'detailed', 'a_q10');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q10_o3', 'cursory', 'a_q10');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q10_o4', 'thorough', 'a_q10');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q11_o1', 'yielding', 'a_q11');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q11_o2', 'flexible', 'a_q11');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q11_o3', 'stubborn', 'a_q11');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q11_o4', 'compliant', 'a_q11');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q12_o1', 'steady', 'a_q12');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q12_o2', 'fickle', 'a_q12');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q12_o3', 'uniform', 'a_q12');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q12_o4', 'constant', 'a_q12');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q13_o1', 'rare', 'a_q13');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q13_o2', 'unique', 'a_q13');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q13_o3', 'everywhere', 'a_q13');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q13_o4', 'scarce', 'a_q13');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q14_o1', 'cordiality', 'a_q14');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q14_o2', 'amity', 'a_q14');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q14_o3', 'bitterness', 'a_q14');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q14_o4', 'harmony', 'a_q14');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q15_o1', 'plain', 'a_q15');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q15_o2', 'ugly', 'a_q15');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q15_o3', 'mediocre', 'a_q15');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q15_o4', 'beautiful', 'a_q15');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q16_o1', 'yielding', 'a_q16');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q16_o2', 'flexible', 'a_q16');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q16_o3', 'accommodating', 'a_q16');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q16_o4', 'adamant', 'a_q16');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q17_o1', 'obedient', 'a_q17');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q17_o2', 'compliant', 'a_q17');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q17_o3', 'rebellious', 'a_q17');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q17_o4', 'pliant', 'a_q17');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q18_o1', 'obtuse', 'a_q18');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q18_o2', 'dim', 'a_q18');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q18_o3', 'keen', 'a_q18');
INSERT INTO public."WordsOption" (id, text, "wordsQuestionId") VALUES ('a_q18_o4', 'dull', 'a_q18');


--
-- TOC entry 4934 (class 0 OID 30624)
-- Dependencies: 226
-- Data for Name: WordsCorrectAnswer; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('b_q1_ca', 'b_q1', 'b_q1_o1');
INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('b_q2_ca', 'b_q2', 'b_q2_o1');
INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('b_q3_ca', 'b_q3', 'b_q3_o1');
INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('b_q4_ca', 'b_q4', 'b_q4_o1');
INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('b_q5_ca', 'b_q5', 'b_q5_o1');
INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('b_q6_ca', 'b_q6', 'b_q6_o1');
INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('b_q7_ca', 'b_q7', 'b_q7_o1');
INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('b_q8_ca', 'b_q8', 'b_q8_o1');
INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('b_q9_ca', 'b_q9', 'b_q9_o1');
INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('b_q10_ca', 'b_q10', 'b_q10_o1');
INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('i_q1_ca', 'i_q1', 'i_q1_o1');
INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('i_q2_ca', 'i_q2', 'i_q2_o1');
INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('i_q3_ca', 'i_q3', 'i_q3_o1');
INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('i_q4_ca', 'i_q4', 'i_q4_o1');
INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('i_q10_ca', 'i_q10', 'i_q10_o1');
INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('i_q11_ca', 'i_q11', 'i_q11_o1');
INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('i_q12_ca', 'i_q12', 'i_q12_o1');
INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('i_q13_ca', 'i_q13', 'i_q13_o1');
INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('i_q14_ca', 'i_q14', 'i_q14_o1');
INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('i_q15_ca', 'i_q15', 'i_q15_o1');
INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('a_q1_ca', 'a_q1', 'a_q1_o2');
INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('a_q10_ca', 'a_q10', 'a_q10_o3');
INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('a_q11_ca', 'a_q11', 'a_q11_o3');
INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('a_q12_ca', 'a_q12', 'a_q12_o2');
INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('a_q13_ca', 'a_q13', 'a_q13_o3');
INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('a_q14_ca', 'a_q14', 'a_q14_o3');
INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('a_q15_ca', 'a_q15', 'a_q15_o4');
INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('a_q16_ca', 'a_q16', 'a_q16_o4');
INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('a_q17_ca', 'a_q17', 'a_q17_o3');
INSERT INTO public."WordsCorrectAnswer" (id, "wordsQuestionId", "wordsOptionId") VALUES ('a_q18_ca', 'a_q18', 'a_q18_o3');


--
-- TOC entry 4925 (class 0 OID 30540)
-- Dependencies: 217
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('5ec9e159-0e7d-409a-94be-0c2e99a55149', '9e095361aedac304d1308dac23d348e1e64b563a8dfb4554d5d3ed42e6db3e87', '2025-03-15 12:59:58.712952+01', '20250315115958_init', NULL, NULL, '2025-03-15 12:59:58.689047+01', 1);
INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('657c0362-94fa-4c4a-89e5-c97642b86247', 'de9c72cc46dde08bd9084564b77727cbb85b21c5fba6bc8bc961714bf76c9ce2', '2025-04-16 17:00:48.025755+02', '20250416150048_status', NULL, NULL, '2025-04-16 17:00:48.02095+02', 1);
INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('5b205d58-5253-42d4-9ffc-82354978cca4', 'bc06829f4e285fd1f806c68e789c06c27365df5724adf9552b7df157868fcdff', '2025-04-16 20:27:09.01263+02', '20250416182708_achievements', NULL, NULL, '2025-04-16 20:27:08.997879+02', 1);
INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('a3458d41-f85d-49a2-a7f3-006e1849b9d9', 'd8b646b9ae5fcd717c3b148748d3226aff0cb8acd034d857ad8645438143c6c4', '2025-04-16 21:24:29.336919+02', '20250416192429_fix', NULL, NULL, '2025-04-16 21:24:29.329275+02', 1);
INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('cb2af2be-be64-4c66-ab56-93e8ec584ee4', 'bc06829f4e285fd1f806c68e789c06c27365df5724adf9552b7df157868fcdff', '2025-04-16 21:29:03.340427+02', '20250416192903_qf', NULL, NULL, '2025-04-16 21:29:03.331572+02', 1);
INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('b839d203-7e26-4ac6-91d4-f0812d29c36c', '53806bde62d5530c9899901ccca4f54a1dcdd510a40c8500db8dffc9f5a8a6f8', '2025-04-17 14:52:39.54861+02', '20250417125239_add_quiz_completion', NULL, NULL, '2025-04-17 14:52:39.538626+02', 1);


-- Completed on 2025-04-18 21:34:25

--
-- PostgreSQL database dump complete
--

