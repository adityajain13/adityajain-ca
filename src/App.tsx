import { Contact } from './components/Contact'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Projects } from './components/Projects'
import { Resume } from './components/Resume'

export default function App() {
  return (
    <div className="mx-auto max-w-[1040px] px-4 sm:px-8 lg:px-12">
      <Header />
      <main>
        <Hero />
        <Projects />
        <Resume />
      </main>
      <Contact />
    </div>
  )
}
