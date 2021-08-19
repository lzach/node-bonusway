# Node.js app for querying and filtering data from the BonusWay campaign API

To run the app:

```
node .
```

This will download the data, filter out all items that are either not commissioned in percent or whose commission is less or equal to 2.25% and display the resulting titles in alphabetical order.
It's possible to manage the cutoff with the `-a` flag. For example, 

```
node . -a 5
```

will show only items with a commission over 5%.

## Caching

The results will be locally cached. To force the app to redownload the data, use `-f` or `--force`:

```
node . --force
```