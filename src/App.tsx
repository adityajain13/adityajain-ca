import { Contact } from './components/Contact'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Projects } from './components/Projects'
import { WritingAndCurrently } from './components/WritingAndCurrently'

export default function App() {
  return (
    <div className="mx-auto max-w-[1040px] px-4 sm:px-8 lg:px-12">
      <Header />
      <main>
        <Hero />
        <Projects />
        <WritingAndCurrently />
      </main>
      <Contact />
    </div>
  )
}
