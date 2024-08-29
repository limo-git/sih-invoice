import { Command } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const program = new Command();

const promptUser = async () => {
  console.log('Please create the following directories if they do not exist:');
  console.log('1. routes-files');
  console.log('2. markdown-files');
  
  const responses = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'ready',
      message: 'Have you created the directories?',
      default: false,
    },
  ]);

  if (!responses.ready) {
    console.log('Please create the required directories and try again.');
    process.exit(1);
  }
};

const createDirectories = () => {
  const routesFolder = 'routes-files';
  const markdownFolder = 'markdown-files';

  if (!fs.existsSync(routesFolder)) {
    fs.mkdirSync(routesFolder);
    console.log(`Created directory: ${routesFolder}`);
  } else {
    console.log(`Directory already exists: ${routesFolder}`);
  }

  if (!fs.existsSync(markdownFolder)) {
    fs.mkdirSync(markdownFolder);
    console.log(`Created directory: ${markdownFolder}`);
  } else {
    console.log(`Directory already exists: ${markdownFolder}`);
  }
};

const copyMarkdownFiles = () => {
  const markdownFolder = 'markdown-files';
  const destinationFolder = 'src/content/docs';

  if (!fs.existsSync(destinationFolder)) {
    fs.mkdirSync(destinationFolder, { recursive: true });
  }

  const markdownFiles = fs.readdirSync(markdownFolder);
  markdownFiles.forEach((file) => {
    const sourceFile = path.join(markdownFolder, file);
    const destFile = path.join(destinationFolder, file);
    fs.copyFileSync(sourceFile, destFile);
    console.log(`Copied ${sourceFile} to ${destFile}`);
  });
};

const buildContentLayer = () => {
  exec('npx contentlayer build', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }

    console.log(`stdout: ${stdout}`);
  });
};

program
  .command('setup')
  .description('Setup routes and markdown directories')
  .action(async () => {
    console.log("check")
    await promptUser();
    createDirectories();
    copyMarkdownFiles();
    buildContentLayer();
  });

program.parse(process.argv); 
