/*
  # Seed Initial Data

  ## Overview
  Populates the database with initial subjects, sample lessons, quiz questions, 
  achievements, and daily challenges to provide a complete learning experience.

  ## Data Inserted
  - 6 subjects (Mathematics, Science, History, Languages, Technology, Arts)
  - Sample lessons for each subject
  - Quiz questions for each lesson
  - Achievement definitions
  - Sample daily challenges
*/

-- Insert subjects
INSERT INTO subjects (name, description, icon, color) VALUES
  ('Matemáticas', 'Aprende conceptos matemáticos de forma visual', 'calculator', '#3b82f6'),
  ('Ciencias', 'Descubre el mundo de la ciencia', 'flask-conical', '#10b981'),
  ('Historia', 'Explora eventos históricos importantes', 'landmark', '#f59e0b'),
  ('Idiomas', 'Mejora tus habilidades lingüísticas', 'languages', '#8b5cf6'),
  ('Tecnología', 'Domina conceptos de programación y tech', 'cpu', '#06b6d4'),
  ('Arte', 'Aprende sobre arte y creatividad', 'palette', '#ec4899')
ON CONFLICT DO NOTHING;

-- Insert sample lessons for Mathematics
INSERT INTO lessons (subject_id, title, content, duration_minutes, difficulty_level, order_index)
SELECT 
  (SELECT id FROM subjects WHERE name = 'Matemáticas' LIMIT 1),
  'Introducción al Álgebra',
  'El álgebra es una rama de las matemáticas que usa letras y símbolos para representar números y cantidades en fórmulas y ecuaciones. Una ecuación algebraica básica como x + 5 = 10 nos ayuda a encontrar valores desconocidos.',
  2,
  'basic',
  1
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE title = 'Introducción al Álgebra');

INSERT INTO lessons (subject_id, title, content, duration_minutes, difficulty_level, order_index)
SELECT 
  (SELECT id FROM subjects WHERE name = 'Matemáticas' LIMIT 1),
  'Fracciones y Decimales',
  'Las fracciones representan partes de un todo. Por ejemplo, 1/2 significa una mitad. Los decimales son otra forma de expresar fracciones: 1/2 = 0.5. Ambas formas son útiles en diferentes situaciones.',
  2,
  'basic',
  2
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE title = 'Fracciones y Decimales');

-- Insert sample lessons for Science
INSERT INTO lessons (subject_id, title, content, duration_minutes, difficulty_level, order_index)
SELECT 
  (SELECT id FROM subjects WHERE name = 'Ciencias' LIMIT 1),
  'La Célula: Unidad de la Vida',
  'La célula es la unidad básica de todos los seres vivos. Existen dos tipos principales: células procariotas (sin núcleo) y eucariotas (con núcleo). Las células realizan todas las funciones vitales.',
  3,
  'basic',
  1
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE title = 'La Célula: Unidad de la Vida');

INSERT INTO lessons (subject_id, title, content, duration_minutes, difficulty_level, order_index)
SELECT 
  (SELECT id FROM subjects WHERE name = 'Ciencias' LIMIT 1),
  'El Sistema Solar',
  'Nuestro sistema solar está compuesto por el Sol, 8 planetas, y varios cuerpos celestes menores. Los planetas interiores (Mercurio, Venus, Tierra, Marte) son rocosos, mientras que los exteriores (Júpiter, Saturno, Urano, Neptuno) son gaseosos.',
  2,
  'basic',
  2
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE title = 'El Sistema Solar');

-- Insert sample lessons for Technology
INSERT INTO lessons (subject_id, title, content, duration_minutes, difficulty_level, order_index)
SELECT 
  (SELECT id FROM subjects WHERE name = 'Tecnología' LIMIT 1),
  '¿Qué es la Programación?',
  'La programación es el proceso de crear instrucciones que una computadora puede ejecutar. Los programadores usan lenguajes como Python, JavaScript o Java para comunicarse con las máquinas y crear aplicaciones.',
  2,
  'basic',
  1
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE title = '¿Qué es la Programación?');

-- Insert quiz questions for Algebra lesson
INSERT INTO quiz_questions (lesson_id, question_text, options, correct_answer, explanation)
SELECT 
  (SELECT id FROM lessons WHERE title = 'Introducción al Álgebra' LIMIT 1),
  '¿Qué valor tiene x en la ecuación x + 5 = 10?',
  '["3", "5", "10", "15"]'::jsonb,
  1,
  'Para resolver x + 5 = 10, restamos 5 de ambos lados: x = 10 - 5 = 5'
WHERE NOT EXISTS (
  SELECT 1 FROM quiz_questions 
  WHERE question_text = '¿Qué valor tiene x en la ecuación x + 5 = 10?'
);

INSERT INTO quiz_questions (lesson_id, question_text, options, correct_answer, explanation)
SELECT 
  (SELECT id FROM lessons WHERE title = 'Introducción al Álgebra' LIMIT 1),
  '¿Cuál es el propósito principal del álgebra?',
  '["Sumar números", "Representar cantidades desconocidas", "Dibujar gráficos", "Calcular áreas"]'::jsonb,
  1,
  'El álgebra usa símbolos y letras para representar y resolver problemas con cantidades desconocidas'
WHERE NOT EXISTS (
  SELECT 1 FROM quiz_questions 
  WHERE question_text = '¿Cuál es el propósito principal del álgebra?'
);

-- Insert quiz questions for Cell lesson
INSERT INTO quiz_questions (lesson_id, question_text, options, correct_answer, explanation)
SELECT 
  (SELECT id FROM lessons WHERE title = 'La Célula: Unidad de la Vida' LIMIT 1),
  '¿Cuál es la diferencia principal entre células procariotas y eucariotas?',
  '["El tamaño", "La presencia de núcleo", "El color", "La forma"]'::jsonb,
  1,
  'Las células eucariotas tienen núcleo definido, mientras que las procariotas no lo tienen'
WHERE NOT EXISTS (
  SELECT 1 FROM quiz_questions 
  WHERE question_text = '¿Cuál es la diferencia principal entre células procariotas y eucariotas?'
);

INSERT INTO quiz_questions (lesson_id, question_text, options, correct_answer, explanation)
SELECT 
  (SELECT id FROM lessons WHERE title = 'La Célula: Unidad de la Vida' LIMIT 1),
  '¿Qué son las células?',
  '["Átomos grandes", "Unidades básicas de la vida", "Moléculas", "Partículas de energía"]'::jsonb,
  1,
  'Las células son las unidades básicas y fundamentales de todos los organismos vivos'
WHERE NOT EXISTS (
  SELECT 1 FROM quiz_questions 
  WHERE question_text = '¿Qué son las células?'
);

-- Insert achievements
INSERT INTO achievements (name, description, icon, requirement_type, requirement_value) VALUES
  ('Primera Lección', 'Completa tu primera lección', 'star', 'lessons_completed', 1),
  ('Racha de 3 días', 'Mantén una racha de 3 días consecutivos', 'flame', 'streak', 3),
  ('Racha de 7 días', 'Mantén una racha de 7 días consecutivos', 'flame', 'streak', 7),
  ('Racha de 30 días', 'Mantén una racha de 30 días consecutivos', 'flame', 'streak', 30),
  ('Aprendiz', 'Completa 10 lecciones', 'book-open', 'lessons_completed', 10),
  ('Estudiante', 'Completa 25 lecciones', 'graduation-cap', 'lessons_completed', 25),
  ('Maestro', 'Completa 50 lecciones', 'trophy', 'lessons_completed', 50),
  ('Perfeccionista', 'Obtén 100% en 5 quizzes', 'target', 'perfect_scores', 5),
  ('Explorador', 'Completa lecciones de 3 materias diferentes', 'compass', 'subjects_explored', 3),
  ('Coleccionista', 'Gana 1000 puntos', 'award', 'total_points', 1000)
ON CONFLICT DO NOTHING;

-- Insert daily challenges
INSERT INTO daily_challenges (title, description, challenge_type, requirement, points, active_from, active_until) VALUES
  ('Lección Matutina', 'Completa una lección antes del mediodía', 'daily', '{"type": "lesson_before_time", "time": "12:00"}'::jsonb, 10, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 day'),
  ('Racha Activa', 'Mantén tu racha estudiando hoy', 'daily', '{"type": "complete_any_lesson"}'::jsonb, 15, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 day'),
  ('Quiz Perfecto', 'Obtén 100% en un quiz', 'daily', '{"type": "perfect_quiz_score"}'::jsonb, 20, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 day'),
  ('Maratón Semanal', 'Completa 7 lecciones esta semana', 'weekly', '{"type": "lessons_completed", "count": 7}'::jsonb, 50, CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days'),
  ('Explorador Semanal', 'Estudia 3 materias diferentes esta semana', 'weekly', '{"type": "different_subjects", "count": 3}'::jsonb, 40, CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days')
ON CONFLICT DO NOTHING;