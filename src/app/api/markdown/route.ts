import { NextResponse } from "next/server";
import fs from 'fs/promises';
import path from 'path';
import sanitizeFilename from 'sanitize-filename';
import { exec } from 'child_process';

export async function POST(request: any) {
  try { 
    const { fileName, content } = await request.json();
    const sanitizedFileName = sanitizeFilename(fileName);

    if (!sanitizedFileName) {
      throw new Error('Invalid filename provided.');
    }

    const fileNameWithExtension = `${sanitizedFileName}.mdx`;

    const docsDir = path.join(process.cwd(), 'src', 'content', 'docs');
    await fs.mkdir(docsDir, { recursive: true });

    const filePath = path.join(docsDir, fileNameWithExtension);

    if (content) {
      await fs.writeFile(filePath, content);
    } else {
      await fs.writeFile(filePath, ''); 
    }

    console.log('Current working directory:', process.cwd());

    
    const response = await NextResponse.json({ message: 'File created successfully' }, { status: 200 });

    exec(`chmod +x ${path.join(process.cwd(), 'src', 'content')}`, (err, stdout, stderr) => {
      if (err) {
        console.error('Error executing chmod +x:', err);
        console.error('stderr:', stderr);
        console.log('stdout:', stdout);
        return;
      }
      console.log('chmod +x output:', stdout);

      exec('npx contentlayer build', { cwd: process.cwd() }, (err, stdout, stderr) => {
        if (err) {
          console.error('Error executing contentlayer build:', err);
          console.error('stderr:', stderr);
          console.log('stdout:', stdout);
          return;
        }
        console.log('Contentlayer build output:', stdout);
      });
    });

    return response;
  } catch (error: any) {
    console.error('Error creating file:', error.message);

    return NextResponse.json({ error: 'Failed to create file', message: error.message }, { status: 500 });
  }
}


// import { NextResponse } from "next/server";
// import fs from 'fs/promises';
// import path from 'path';
// import sanitizeFilename from 'sanitize-filename';
// import { exec } from 'child_process';

// export async function POST(request: any) {
//   try { 
//     const { fileName, content } = await request.json();
//     const sanitizedFileName = sanitizeFilename(fileName);

//     if (!sanitizedFileName) {
//       throw new Error('Invalid filename provided.');
//     }

//     const fileNameWithExtension = `${sanitizedFileName}.mdx`;

//     const docsDir = path.join(process.cwd(), 'src', 'content', 'docs');
//     await fs.mkdir(docsDir, { recursive: true });

//     const filePath = path.join(docsDir, fileNameWithExtension);

//     if (content) {
//       await fs.writeFile(filePath, content);
//     } else {
//       await fs.writeFile(filePath, ''); 
//     }

//     console.log('Current working directory:', process.cwd());

    
//     const response = await NextResponse.json({ message: 'File created successfully' }, { status: 200 });

//     exec(`chmod +x ${path.join(process.cwd(), 'src', 'content')}`, (err, stdout, stderr) => {
//       if (err) {
//         console.error('Error executing chmod +x:', err);
//         console.error('stderr:', stderr);
//         console.log('stdout:', stdout);
//         return;
//       }
//       console.log('chmod +x output:', stdout);

//       exec('npx contentlayer build', { cwd: process.cwd() }, (err, stdout, stderr) => {
//         if (err) {
//           console.error('Error executing contentlayer build:', err);
//           console.error('stderr:', stderr);
//           console.log('stdout:', stdout);
//           return;
//         }
//         console.log('Contentlayer build output:', stdout);
//       });
//     });

//     return response;
//   } catch (error: any) {
//     console.error('Error creating file:', error.message);

//     return NextResponse.json({ error: 'Failed to create file', message: error.message }, { status: 500 });
//   }
// }