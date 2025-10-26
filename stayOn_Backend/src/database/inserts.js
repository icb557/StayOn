import bcrypt from 'bcrypt'
import { User } from '../models/user.model.js'
import { Topic } from '../models/topic.model.js'
import { Post } from '../models/post.model.js'
import { Material } from '../models/material.model.js'
import { Comment } from '../models/comment.model.js'
import { Follower } from '../models/follower.model.js'

export async function insertData () {
  const password = await bcrypt.hash('P@ssw0rd', 12)

  const users = [
    {
      email: 'isac_cortes82212@elpoli.edu.co',
      password,
      firstName: 'Isac',
      lastName: 'Cortés',
      secondLastName: 'Buitrago',
      major: 'Ingeniería de Sistemas',
      role: 'estudiante',
      age: 20
    },
    {
      email: 'emmanuel_bolivar82212@elpoli.edu.co',
      password,
      firstName: 'Emmanuel',
      lastName: 'Bolívar',
      secondLastName: 'Marín',
      major: 'Deportes',
      role: 'estudiante',
      age: 21
    },
    {
      email: 'juan_estrada82212@elpoli.edu.co',
      password,
      firstName: 'Juan',
      middleName: 'José',
      lastName: 'Estrada',
      secondLastName: 'Vélez',
      major: 'Comunicación Audiovisual',
      role: 'estudiante',
      age: 21
    },
    {
      email: 'juan_adams82212@elpoli.edu.co',
      password,
      firstName: 'Juan',
      middleName: 'Pablo',
      lastName: 'Adams',
      secondLastName: 'Parra',
      major: 'Masoterapia',
      role: 'estudiante',
      age: 21
    }
  ]

  const topics = [
    { name: 'Ciencias de la Computación' },
    { name: 'Matemáticas' },
    { name: 'Física' },
    { name: 'Química' },
    { name: 'Biología' },
    { name: 'Ingeniería' },
    { name: 'Economía' },
    { name: 'Historia' },
    { name: 'Literatura' },
    { name: 'Filosofía' }
  ]

  // First create users to get their IDs
  const createdUsers = await User.bulkCreate(users)
  await Topic.bulkCreate(topics)

  // Add random preferences for users
  const usersList = await User.findAll()
  const topicsList = await Topic.findAll()

  for (const user of usersList) {
    // Randomly select 1 to 3 topics for each user, ensuring uniqueness
    const numTopics = Math.floor(Math.random() * 3) + 1 // 1 to 3 topics
    const shuffledTopics = topicsList.slice().sort(() => 0.5 - Math.random())
    const randomTopics = shuffledTopics.slice(0, numTopics)
    await user.addTopics(randomTopics) // This creates the Preference entries
  }

  // Map users by email for easy reference
  const userMap = {}
  createdUsers.forEach((user) => {
    userMap[user.email] = user.id
  })

  const posts = [
    {
      message:
        '¡Hola a todos! Estoy emocionado de comenzar a explorar los fundamentos de la Ciencias de la Computación. ¿Algún consejo para un principiante?',
      date: new Date('2025-05-10T14:30:00Z'),
      userId: userMap['isac_cortes82212@elpoli.edu.co'],
      topicId: 1
    },
    {
      message:
        '¿Alguien más encuentra fascinante la belleza abstracta de las Matemáticas puras? Estoy particularmente interesado en la teoría de números.',
      date: new Date('2025-05-11T09:15:00Z'),
      userId: userMap['juan_adams82212@elpoli.edu.co'],
      topicId: 2
    },
    {
      message:
        'Reflexionando sobre los últimos avances en Física cuántica. ¡Es increíble cómo nuestra comprensión del universo sigue evolucionando!',
      date: new Date('2025-05-12T16:45:00Z'),
      userId: userMap['juan_estrada82212@elpoli.edu.co'],
      topicId: 3
    },
    {
      message:
        'Hoy en clase de Química aprendimos sobre las reacciones orgánicas. ¡El mundo molecular es realmente asombroso!',
      date: new Date('2025-05-13T11:00:00Z'),
      userId: userMap['emmanuel_bolivar82212@elpoli.edu.co'],
      topicId: 4
    },
    {
      message:
        'Investigando sobre la diversidad de los ecosistemas en Biología. Cada forma de vida tiene un papel crucial. 🌱',
      date: new Date('2025-05-14T18:20:00Z'),
      userId: userMap['isac_cortes82212@elpoli.edu.co'],
      topicId: 5
    },
    {
      message:
        'Como futuro ingeniero, estoy pensando en los desafíos de la energía sostenible. ¿Qué soluciones creen que son más prometedoras?',
      date: new Date('2025-05-15T10:50:00Z'),
      userId: userMap['juan_adams82212@elpoli.edu.co'],
      topicId: 6
    },
    {
      message:
        'Analizando los modelos económicos actuales. ¿Cuáles son sus perspectivas sobre el futuro de la economía global?',
      date: new Date('2025-05-16T15:05:00Z'),
      userId: userMap['juan_estrada82212@elpoli.edu.co'],
      topicId: 7
    },
    {
      message:
        'Leyendo sobre la Revolución Francesa en clase de Historia. ¡Un período de cambios radicales y profundas consecuencias!',
      date: new Date('2025-05-17T12:35:00Z'),
      userId: userMap['emmanuel_bolivar82212@elpoli.edu.co'],
      topicId: 8
    },
    {
      message:
        'Disfrutando de la lectura de "Cien años de soledad". La riqueza del lenguaje y la narrativa en la Literatura latinoamericana es incomparable.',
      date: new Date('2025-05-18T09:00:00Z'),
      userId: userMap['isac_cortes82212@elpoli.edu.co'],
      topicId: 9
    },
    {
      message:
        'Profundizando en los debates éticos de la Filosofía contemporánea. ¿Cuáles son las preguntas que más les hacen reflexionar?',
      date: new Date('2025-05-19T17:40:00Z'),
      userId: userMap['juan_adams82212@elpoli.edu.co'],
      topicId: 10
    }
  ]

  // Create posts
  await Post.bulkCreate(posts)

  const materials = [
    {
      name: 'doc1',
      uri: 'https://example.com/material1.pdf',
      type: 'document',
      postId: 1
    },
    {
      name: 'doc2',
      uri: 'https://example.com/material2.docx',
      type: 'document',
      postId: 2
    },
    {
      name: 'img1',
      uri: 'https://example.com/material3.jpg',
      type: 'image',
      postId: 3
    },
    {
      name: 'vid1',
      uri: 'https://example.com/material4.mp4',
      type: 'video',
      postId: 4
    },
    {
      name: 'url1',
      uri: 'https://example.com/material5.html',
      type: 'url',
      postId: 5
    },
    {
      name: 'url2',
      uri: 'https://example.com/material6.php',
      type: 'url',
      postId: 4
    },
    {
      name: 'img2',
      uri: 'https://example.com/material7.png',
      type: 'image',
      postId: 4
    },
    {
      name: 'doc3',
      uri: 'https://example.com/material8.pdf',
      type: 'document',
      postId: 4
    },
    {
      name: 'vid2',
      uri: 'https://example.com/physics_explained.mov',
      type: 'video',
      postId: 3
    },
    {
      name: 'article_math',
      uri: 'https://en.wikipedia.org/wiki/Mathematical_proof',
      type: 'url',
      postId: 2
    },
    {
      name: 'chemistry_book_chapter',
      uri: 'https://example.com/organic_chem_chapter1.pdf',
      type: 'document',
      postId: 4
    },
    {
      name: 'biology_image',
      uri: 'https://example.com/cell_structure.jpeg',
      type: 'image',
      postId: 5
    },
    {
      name: 'engineering_diagram',
      uri: 'https://example.com/bridge_design.svg',
      type: 'image',
      postId: 6
    },
    {
      name: 'economics_report',
      uri: 'https://example.com/global_economy_outlook.pdf',
      type: 'document',
      postId: 7
    },
    {
      name: 'history_documentary',
      uri: 'https://example.com/french_revolution.webm',
      type: 'video',
      postId: 8
    },
    {
      name: 'literature_analysis',
      uri: 'https://example.com/soledad_analysis.html',
      type: 'url',
      postId: 9
    },
    {
      name: 'philosophy_audio',
      uri: 'https://example.com/ethics_discussion.mp3',
      type: 'audio',
      postId: 10
    }
  ]

  const comments = [
    {
      message:
        '¡Bienvenido! Empieza por los algoritmos básicos y la lógica de programación. ¡Es un viaje fascinante!',
      date: new Date('2025-05-10T14:40:00Z'),
      postId: 1,
      userId: userMap['juan_estrada82212@elpoli.edu.co']
    },
    {
      message:
        'Totalmente de acuerdo. La teoría de números es como un universo escondido dentro de las matemáticas.',
      date: new Date('2025-05-11T09:25:00Z'),
      postId: 2,
      userId: userMap['emmanuel_bolivar82212@elpoli.edu.co']
    },
    {
      message:
        'A veces me cuesta creer lo que los físicos descubren. ¡Es como magia, pero real!',
      date: new Date('2025-05-12T16:55:00Z'),
      postId: 3,
      userId: userMap['isac_cortes82212@elpoli.edu.co']
    },
    {
      message:
        '¡Las reacciones orgánicas son la base de la vida! Es increíble cómo se combinan los átomos.',
      date: new Date('2025-05-13T11:10:00Z'),
      postId: 4,
      userId: userMap['juan_adams82212@elpoli.edu.co']
    },
    {
      message:
        'La interconexión de la vida es algo que siempre me asombra. ¡Debemos proteger nuestra biodiversidad!',
      date: new Date('2025-05-14T18:30:00Z'),
      postId: 5,
      userId: userMap['juan_estrada82212@elpoli.edu.co']
    },
    {
      message:
        'Creo que la energía solar y la eólica son las más prometedoras a largo plazo, aunque requieren inversión e innovación.',
      date: new Date('2025-05-15T11:00:00Z'),
      postId: 6,
      userId: userMap['emmanuel_bolivar82212@elpoli.edu.co']
    },
    {
      message:
        'La economía es un campo complejo, pero crucial para entender el mundo. Estoy interesado en la economía del comportamiento.',
      date: new Date('2025-05-16T15:15:00Z'),
      postId: 7,
      userId: userMap['isac_cortes82212@elpoli.edu.co']
    },
    {
      message:
        'La Revolución Francesa nos enseña mucho sobre el poder del pueblo y la necesidad de justicia social.',
      date: new Date('2025-05-17T12:45:00Z'),
      postId: 8,
      userId: userMap['juan_adams82212@elpoli.edu.co']
    },
    {
      message:
        '"Cien años de soledad" es una obra maestra. García Márquez creó un mundo mágico y lleno de simbolismo.',
      date: new Date('2025-05-18T09:10:00Z'),
      postId: 9,
      userId: userMap['juan_estrada82212@elpoli.edu.co']
    },
    {
      message:
        'La filosofía nos invita a cuestionar todo. Me interesa especialmente la ética y la filosofía de la mente.',
      date: new Date('2025-05-19T17:50:00Z'),
      postId: 10,
      userId: userMap['emmanuel_bolivar82212@elpoli.edu.co']
    }
  ]

  const followers = [
    {
      followedId: userMap['isac_cortes82212@elpoli.edu.co'],
      followerId: userMap['juan_adams82212@elpoli.edu.co']
    },
    {
      followedId: userMap['isac_cortes82212@elpoli.edu.co'],
      followerId: userMap['juan_estrada82212@elpoli.edu.co']
    },
    {
      followedId: userMap['isac_cortes82212@elpoli.edu.co'],
      followerId: userMap['emmanuel_bolivar82212@elpoli.edu.co']
    },
    {
      followedId: userMap['juan_adams82212@elpoli.edu.co'],
      followerId: userMap['isac_cortes82212@elpoli.edu.co']
    },
    {
      followedId: userMap['juan_adams82212@elpoli.edu.co'],
      followerId: userMap['juan_estrada82212@elpoli.edu.co']
    },
    {
      followedId: userMap['juan_adams82212@elpoli.edu.co'],
      followerId: userMap['emmanuel_bolivar82212@elpoli.edu.co']
    },
    {
      followedId: userMap['juan_estrada82212@elpoli.edu.co'],
      followerId: userMap['isac_cortes82212@elpoli.edu.co']
    },
    {
      followedId: userMap['juan_estrada82212@elpoli.edu.co'],
      followerId: userMap['juan_adams82212@elpoli.edu.co']
    },
    {
      followedId: userMap['juan_estrada82212@elpoli.edu.co'],
      followerId: userMap['emmanuel_bolivar82212@elpoli.edu.co']
    },
    {
      followedId: userMap['emmanuel_bolivar82212@elpoli.edu.co'],
      followerId: userMap['isac_cortes82212@elpoli.edu.co']
    },
    {
      followedId: userMap['emmanuel_bolivar82212@elpoli.edu.co'],
      followerId: userMap['juan_adams82212@elpoli.edu.co']
    },
    {
      followedId: userMap['emmanuel_bolivar82212@elpoli.edu.co'],
      followerId: userMap['juan_estrada82212@elpoli.edu.co']
    }
  ]

  await Material.bulkCreate(materials)
  await Comment.bulkCreate(comments)
  await Follower.bulkCreate(followers)
  console.log('Data inserted successfully')
}
