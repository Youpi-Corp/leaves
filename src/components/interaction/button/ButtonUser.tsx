import React from 'react'
import { useCurrentUser } from '../../../api/user/user.services'
import Button from './Button'
import { FaCog, FaFolder, FaUser, FaUserCircle } from 'react-icons/fa'
import ButtonDropdown from './ButtonDropdown'
import { Dropdown, DropdownItem } from '../../layout/Dropdown'
import Separator from '../../layout/Separator'
import { FaArrowRightFromBracket } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import { useLogout } from '../../../api/user/user.services'

interface UserButtonProps {
  className?: string
}

const ButtonUser: React.FC<UserButtonProps> = ({ className }) => {
  const { data, isSuccess } = useCurrentUser()
  const navigate = useNavigate()
  const { logout } = useLogout()

  return (
    <>
      {isSuccess ? (
        <ButtonDropdown
          dropdown={
            <Dropdown className="top-20 w-60 right-4">
              <DropdownItem icon={<FaFolder />}>My Courses</DropdownItem>
              <DropdownItem icon={<FaCog />}>Preferences</DropdownItem>
              <DropdownItem
                icon={<FaUser />}
                to="/profile">
                  Profile
              </DropdownItem>
              <Separator className="bg-bfbase-lightgrey m-2" />
              <DropdownItem
                icon={<FaArrowRightFromBracket />}
                className="text-bfred-base hover:bg-bfred-lighter"
                onClick={logout}
              >
                Logout
              </DropdownItem>
            </Dropdown>
          }
          icon={<FaUserCircle />}
          className={className}
        >
          {data?.pseudo}
        </ButtonDropdown>
      ) : (
        <Button
          icon={<FaUser />}
          className={className}
          onClick={() => navigate('/login')}
        >
          Sign in
        </Button>
      )}
    </>
  )
}

export default ButtonUser
