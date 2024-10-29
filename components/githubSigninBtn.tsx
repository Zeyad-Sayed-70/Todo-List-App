"use client";
import React from "react";
import { Button } from "./ui/button";
import { Github } from "lucide-react";
import { signInWithGithub } from "@/app/(auth-pages)/clientActions";

const GithubSigninBtn = () => {
  return (
    <Button type="button" onClick={signInWithGithub}>
      <Github /> Sign in with Github
    </Button>
  );
};

export default GithubSigninBtn;
