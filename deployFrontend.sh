rsync -r src/ docs/
rsync build/contracts/* docs/
git add .
git commit -m "Compiles assests for Github Pages"
git push -u origin main
