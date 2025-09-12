import React from 'react'
import { FaArrowRight, FaYoutube } from 'react-icons/fa'
import { FaMeta, FaXTwitter } from 'react-icons/fa6'
import LinkInternal from '../components/interaction/link/LinkInternal'
import Button from '../components/interaction/button/Button'
import Separator from '../components/layout/Separator'

const Footer: React.FC = () => {
  return (
    <footer className="relative z-0 w-full bg-gradient-to-b from-transparent to-bfbrown-lighter px-16 py-8 mt-auto">
      <div className="flex items-start justify-between w-full">
        <div className="flex space-x-10">
          <ul className="space-y-1 text-sm font-medium">
            <li className="text-bfbrown-dark text-sm font-semibold mb-3">
              Getting started
            </li>
            <li>
              <LinkInternal accent="secondary" to="/about">
                Why BrainForest
              </LinkInternal>
            </li>
            <li>
              <LinkInternal accent="secondary" to="/write-course">
                Write a course
              </LinkInternal>
            </li>
            <li>
              <LinkInternal accent="secondary" to="/how-it-works">
                How BrainForest works
              </LinkInternal>
            </li>
          </ul>

          <ul className="space-y-1 text-sm font-medium">
            <li className="text-bfbrown-dark text-sm font-semibold mb-3">
              Developers
            </li>
            <li>
              <LinkInternal accent="secondary" to="/docs">
                Documentation
              </LinkInternal>
            </li>
            <li>
              <LinkInternal accent="secondary" to="/changelog">
                Changelogs
              </LinkInternal>
            </li>
            <li>
              <LinkInternal accent="secondary" to="/contribute">
                Contribute
              </LinkInternal>
            </li>
          </ul>
        </div>

        <div className="flex flex-col space-y-1 w-64">
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

      <div className="flex items-center justify-between w-full">
        <ul className="flex flex-row space-x-6 text-sm font-medium">
          <li className="text-bfbrown-dark font-semibold">
            © 2025 BrainForest
          </li>
          <li>
            <LinkInternal accent="secondary" to="/privacy">
              Privacy Policy
            </LinkInternal>
          </li>
          <li>
            <LinkInternal accent="secondary" to="/terms">
              Terms of Service
            </LinkInternal>
          </li>
          <li>
            <LinkInternal accent="secondary" to="/cookies">
              Cookie Preferences
            </LinkInternal>
          </li>
          <li>
            <a
              href="https://framaforms.org/brainforest-retour-general-1750810810"
              target="_blank"
              rel="noopener noreferrer"
              className="text-bfbrown-base hover:text-bfbrown-dark transition-colors cursor-pointer"
            >
              Signal a bug
            </a>
          </li>
        </ul>

        <ul className="flex flex-row justify-end text-xl space-x-6 text-bfbrown-base">
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
