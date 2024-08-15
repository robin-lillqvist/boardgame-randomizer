import { Navbar as NextUINavbar, NavbarContent, NavbarBrand, NavbarItem } from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { TwitterIcon, DiscordIcon, Logo } from "@/components/icons";

export const Navbar = () => {
  return (
    <NextUINavbar maxWidth='xl' position='sticky'>
      <NavbarContent className='basis-1/5 sm:basis-full' justify='start'>
        <NavbarBrand as='li' className='gap-3 max-w-fit'>
          <NextLink className='flex justify-start items-center gap-1' href='/'>
            <Logo />
            <p className='font-bold text-inherit'>Boardgame Randomizer</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className='sm:flex basis-1/5 sm:basis-full' justify='end'>
        <NavbarItem className='sm:flex gap-2'>
          <Link isExternal aria-label='Twitter' href={siteConfig.links.twitter}>
            <TwitterIcon className='text-default-500' />
          </Link>
          <Link isExternal aria-label='Discord' href={siteConfig.links.discord}>
            <DiscordIcon className='text-default-500' />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
};
