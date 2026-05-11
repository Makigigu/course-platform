import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Clean existing data
  await prisma.certificate.deleteMany()
  await prisma.review.deleteMany()
  await prisma.progress.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.quiz.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.section.deleteMany()
  await prisma.course.deleteMany()
  await prisma.user.deleteMany()

  // 1. Create Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@skillnova.com',
      name: 'ผู้ดูแลระบบ (Admin)',
      role: 'ADMIN',
    },
  })

  const instructor = await prisma.user.create({
    data: {
      email: 'instructor@skillnova.com',
      name: 'อาจารย์ผู้เชี่ยวชาญ',
      role: 'INSTRUCTOR',
    },
  })

  const student = await prisma.user.create({
    data: {
      email: 'student@skillnova.com',
      name: 'นักเรียนตัวอย่าง',
      role: 'STUDENT',
    },
  })

  console.log('Created users:', { admin: admin.id, instructor: instructor.id, student: student.id })

  // 2. Create Courses
  const coursesData = [
    {
      title: 'การพัฒนาเว็บแอปพลิเคชันสมัยใหม่ขั้นสูงด้วย React และ Next.js',
      description: 'เรียนรู้ React, Next.js และ Prisma ผ่านการสร้างโปรเจกต์ใช้งานจริง เหมาะสำหรับนักพัฒนาที่ต้องการอัปสกิลสู่ระดับ Senior',
      price: 2990,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'พื้นฐานการเขียนโปรแกรม Python สำหรับ Data Science',
      description: 'ก้าวแรกสู่วงการ Data Science ด้วยภาษา Python เรียนรู้ Pandas, NumPy และการวิเคราะห์ข้อมูลเบื้องต้น',
      price: 1500,
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'การออกแบบ UI/UX ระดับมืออาชีพด้วย Figma',
      description: 'เจาะลึกกระบวนการออกแบบ User Interface และ User Experience สร้าง Prototype ที่ใช้งานได้จริง',
      price: 1990,
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'เจาะลึก Cloud Computing ด้วย AWS',
      description: 'เรียนรู้การวางระบบบน Cloud ด้วย Amazon Web Services ตั้งแต่ EC2, S3 ไปจนถึงการทำ Auto Scaling',
      price: 3500,
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'การพัฒนา Mobile App ด้วย Flutter',
      description: 'สร้างแอปพลิเคชันมือถือแบบ Cross-platform สำหรับ iOS และ Android ด้วยโค้ดเบสเดียว',
      price: 2500,
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'การจัดการโปรเจกต์แบบ Agile และ Scrum',
      description: 'เรียนรู้วิธีบริหารจัดการโปรเจกต์ไอทีให้มีประสิทธิภาพ ทำงานเป็นทีมได้อย่างราบรื่นด้วย Agile',
      price: 1200,
      thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'ศิลปะการนำเสนอและ Public Speaking',
      description: 'พัฒนาทักษะการพูดต่อหน้าชุมชน การสร้างสไลด์ที่น่าสนใจ และการโน้มน้าวใจผู้ฟัง',
      price: 990,
      thumbnail: 'https://images.unsplash.com/photo-1475721025505-2312693240e8?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'การถ่ายภาพและการจัดแสงแบบมืออาชีพ',
      description: 'เรียนรู้เทคนิคการถ่ายภาพ การควบคุมกล้อง และการจัดแสงเพื่อสร้างผลงานระดับสตูดิโอ',
      price: 1750,
      thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'สร้างแบรนด์ส่วนตัวบนโลก Digital Marketing',
      description: 'กลยุทธ์การตลาดออนไลน์ เทคนิคการใช้ Social Media เพื่อขยายฐานลูกค้าและสร้างตัวตน',
      price: 2200,
      thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'การพัฒนาเกมด้วย Unity เบื้องต้น',
      description: 'ก้าวแรกสู่วงการนักพัฒนาเกม เรียนรู้ C# และเอนจิ้น Unity เพื่อสร้างเกม 2D และ 3D',
      price: 2790,
      thumbnail: 'https://images.unsplash.com/photo-1556438064-2d7646166914?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'เจาะลึกภาษา C++ สำหรับ Algorithms',
      description: 'ฝึกฝนกระบวนการคิดเชิงตรรกะ โครงสร้างข้อมูล และอัลกอริทึมเพื่อการสอบแข่งขัน',
      price: 1350,
      thumbnail: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'สร้างรายได้ด้วย AI และ Machine Learning',
      description: 'ประยุกต์ใช้เทคโนโลยีปัญญาประดิษฐ์เพื่อต่อยอดธุรกิจและสร้างนวัตกรรมแห่งอนาคต',
      price: 4200,
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop'
    }
  ];

  for (let i = 0; i < coursesData.length; i++) {
    const cData = coursesData[i];
    await prisma.course.create({
      data: {
        title: cData.title,
        description: cData.description,
        price: cData.price,
        thumbnail: cData.thumbnail,
        instructorId: instructor.id,
        sections: {
          create: [
            {
              title: 'บทนำและการเตรียมความพร้อม',
              order: 1,
              lessons: {
                create: [
                  {
                    title: 'บทแนะนำเนื้อหาคอร์สเรียน',
                    order: 1,
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                  },
                  {
                    title: 'การติดตั้งเครื่องมือที่จำเป็น',
                    order: 2,
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                  }
                ]
              }
            },
            {
              title: 'เจาะลึกเนื้อหาหลัก',
              order: 2,
              lessons: {
                create: [
                  {
                    title: 'การประยุกต์ใช้งานจริง',
                    order: 1,
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                  },
                  {
                    title: 'แบบทดสอบความเข้าใจ',
                    order: 2,
                    isQuiz: true,
                    quiz: {
                      create: {
                        questions: [
                          {
                            question: 'คุณพร้อมสำหรับการลงมือปฏิบัติจริงหรือยัง?',
                            options: ['พร้อมมาก!', 'ยังไม่พร้อมขอทวนอีกรอบ', 'ขอตัวไปพักก่อน'],
                            answer: 0
                          }
                        ]
                      }
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    });
  }

  console.log('Created 7 diverse courses');
  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
