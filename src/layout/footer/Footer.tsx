import React from 'react'
import Button from '../../components/interaction/button/Button'
import { FaArrowRight, FaYoutube } from 'react-icons/fa'
import Separator from '../../components/layout/Separator'
import { FaMeta, FaXTwitter } from 'react-icons/fa6'
import Link from '../../components/interaction/link/Link'

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-bfbrown-lighter px-16 py-8 mt-[100hv]">
      <div className="flex items-center space-x-10">
        <ul className="space-y-1 text-sm font-medium">
          <li className="text-bfbrown-dark text-sm font-semibold mb-3">
            Getting started
          </li>
          <li>
            <Link accent="secondary">Why BrainForest</Link>
          </li>
          <li>
            <Link accent="secondary">Write a course</Link>
          </li>
          <li>
            <Link accent="secondary">How BrainForest works</Link>
          </li>
        </ul>

        <ul className="space-y-1 text-sm font-medium">
          <li className="text-bfbrown-dark text-sm font-semibold mb-3">
            Developers
          </li>
          <li>
            <Link accent="secondary">Documentation</Link>
          </li>
          <li>
            <Link accent="secondary">Changelogs</Link>
          </li>
          <li>
            <Link accent="secondary">Contribute</Link>
          </li>
        </ul>

        <div className="absolute right-16 flex flex-col space-y-1 w-64">
          <h1 className="text-bfbrown-dark text-sm font-semibold">
            Stay in the loop
          </h1>
          <span className="text-bfbrown-base text-sm font-medium">
            Sign up to our newsletter for monthly updates on our products
          </span>
          <Button
            accent="secondary"
            icon={<FaArrowRight />}
            className="py-2 text-sm"
          >
            Subscribe
          </Button>
        </div>
      </div>

      <Separator className="my-4 bg-bfbrown-light" />

      <div className="flex items-center">
        <ul className="flex flex-row space-x-6 text-sm font-medium">
          <li className="text-bfbrown-dark font-semibold mr-2">
            © 2025 BrainForest
          </li>
          <li>
            <Link accent="secondary">Privacy Policy</Link>
          </li>
          <li>
            <Link accent="secondary">Terms of Service</Link>
          </li>
          <li>
            <Link accent="secondary">Cookie Preferences</Link>
          </li>
        </ul>

        <ul className="absolute right-16 flex flex-row justify-end text-xl space-x-6 text-bfbrown-base">
          <li className="hover:text-bfbrown-dark transition-colors cursor-pointer">
            <FaMeta />
          </li>
          <li className="hover:text-bfbrown-dark transition-colors cursor-pointer">
            <FaXTwitter />
          </li>
          <li className="hover:text-bfbrown-dark transition-colors cursor-pointer">
            <FaYoutube />
          </li>
        </ul>
      </div>
    </footer>
  )
}

export default Footer
