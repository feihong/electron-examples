# Display content served by Python app

# Notes

If you have Python as the main process and electron as the child process, quitting from the
command line via ctrl+c causes error dialogs to appear. This doesn't happen on
Mac. It may make more sense to make electron the main process that starts the
Python app as a child process.
